# Testeo del flujo — Crear reseña (rooms)

> Flujo: usuario autenticado crea una reseña de una dirección (con rooms), la cual se emite vía **server action** sobre el RPC `create_review` de la DB.

## Qué cambió en la migración

1. La action `createReviewAction` usa `createServerActionDeps()`: obtiene el cliente de server supabase, valida `getUser()` y aplica el rate limiter **en el server** (`review.actions.ts`).
2. Rate limit por **usuario** (`create-review:<userId>`, scope `write`, 5/10s) — ya no depende del cliente.
3. Los rooms van en el body del RPC (`p_review_rooms` como jsonb **array**) — mismo patrón que `update` (ver guía de edición, la que crasheó por este bug).

## Prerequisitos

- Sesión activa (login template desde [`login.md`](./login.md)).
- Redis y stack local arriba; `pnpm dev`.
- Dirección seleccionada (flujo de búsqueda `explore`/search) con `address_osm_id` válido.

## 1. Happy path manual

1. Con sesión, ir a crear reseña para una dirección (ej: `/review/create?...` dos parámetros de dirección).
2. Completar título (máx por schema), descripción, rating 1–5 y **al menos 1 room** (`kitchen`, 15 m²).
3. Enviar.
4. ✅ Success: reseña creada, redirección a la vista de detalle; el RPC devolvió `review_id`.
5. Verificar en DB (Supabase Studio o psql):
   - `select * from reviews where id = '<id>'` → `user_id` correcto, `deleted_at` null.
   - `select * from review_rooms where review_id = '<id>'` → los rooms insertados (≥ 1).
   - `select * from review_audit where review_id = '<id>'` →registro inicial del trigger `log_review_changes`.

## 2. Validaciones / fail paths

| Situación | Resultado esperado |
|---|---|
| Sin sesión (cookie inválida manual) | `UNAUTHORIZED` "Debés iniciar sesión." — la action NO escribe |
| Rating fuera de 1–5 | error de validación client/server |
| Subtítulo sobre el max len del schema | mensaje del zod, sin POST |
| Repetir rápido: 6 creaciones en < 10 s | la 6ta rechazada por el Redis (`write` 5/10s) — toast de error, sin crear en DB |
| `p_review_rooms` como string (regresión) | 🔥 el RPC rechaza con `jsonb_typeof <> 'array'` — misma causa del bug de edición |
| Palabras ofensivas (bad-words filter) | rechazo con error de texto |

## 3. Rate limit (verificación)

```text
key:     create-review:<user_uuid>
scope:   write  (5 per 10 s)
```

- Hacer 5 creaciones seguidas y confirmar que la 6ta falla específicamente por el limiter (mensaje de rate limit, no un error del RPC).
- Verificar key en Upstash: `create-review:<user_uuid>` con TTL ≤ 10s.
- Re-usar la misma ventana: borrar key en Upstash.

## 4. Cobertura en suites

| Nivel | Suite / comando | Qué cubre |
|---|---|---|
| Unit | `src/modules/property-reviews/application/commands/__tests__/create-property-review.use-case.spec.ts` | rate limit correcto (`create-review:<id>`, `write`), orden de operaciones, error del repository propagado |
| Unit | `src/modules/property-reviews/presentation/__tests__/review.actions.spec.ts` | action guardada, deps mockeadas (`createServerActionDeps`) |
| Unit | `supabase-property-review-command.repository.test.ts` | firma del RPC `create_review` (array real de rooms, ej. `JSON.parse(JSON.stringify())`) |
| E2E | `e2e/specs/review-create-full.spec.ts` | flujo completo UI (works con env real/disabled) |
| E2E | `e2e/specs/review-crud.spec.ts` | CRUD base |
| Integración DB | `pnpm test:services` → assert "create_review (A, RPC) — crea review con rooms" | RPC con auth real + rooms + jsonb correcto |

## 5. Casos borde y subflujos — exhaustiva (crear reseña)

### 5.1 Validaciones de entrada

| # | Caso | Resultado esperado |
|---|---|---|
| C1 | Título vacío | zod rechaza, sin POST |
| C2 | Título sobre el max len del schema | mensaje del zod |
| C3 | Rating fuera de 1–5 (hacks de DevTools en el select) | zod rejerta; si pasa client, la DB lo rechaza por constraint |
| C4 | Room con `area_m2` 0/negativa | rechazo (constraint `area_m2 > 0`) — ⏳ confirmar check name |
| C5 | `room_type` fuera del enum | rechazo por constraint/enum |
| C6 | Muchos rooms | límite razonable por RPC — ⏳ verificar cuota y mensaje |
| C7 | Sin rooms (array vacío) | permitido ⏳ — la reseña se crea sin rooms |
| C8 | Texto con palabras filtradas (bad-words) | rechazo de validación de texto |
| C9 | Dirección inexistent/inconsistente (`address_osm_id` falso) | la reseña se crea igual si pasa el schema — ⏳ verificar si hay validación de OSM |

### 5.2 Auth y permisos

| # | Caso | Resultado esperado |
|---|---|---|
| C10 | Sin sesión (cookie inválida) | `UNAUTHORIZED`, nada se escribe |
| C11 | `user_id` de otro usuario forzado en el input | ignorado: el use-case saca el userId del servidor (`getCurrentUserId`), nunca del cliente |
| C12 | JWT expirado entre login del form y submit | el middleware refresca en navegación; la action falla limpia — ⏳ verificar UX del error |

### 5.3 Rate limits y ciclos

| # | Caso | Resultado esperado |
|---|---|---|
| C13 | 5 creaciones en < 10s (misma ventana) | las 5 OK |
| C14 | 6ta del mismo usuario en la ventana | rechazo por Redis `write` (key `create-review:<user>`) |
| C15 | 6ta con window vencida (>10s) | OK — la ventana se limpia sola |
| C16 | Distinct user creando en paralelo | límites independientes (key por usuario) |
| C17 | Redis caído | acción falla con error explícito (no degrada a "sin límite") |

### 5.4 Idempotencia / concurrencia

| # | Caso | Resultado esperado |
|---|---|---|
| C18 | Doble submit del form | 2 creaciones si ambos requests pasan la ventana (5/10s) — ⏳ si es un bug de UX, el guard del botón es el que evita; verificar |
| C19 | Misma dirección reseñada 2 veces por el mismo usuário | CREATE permitido salvo unique ⏳ — verificar constraint o regla feature |
| C20 | Reseña con rooms > ¿N? y rollback parcial | rooms insertados en la misma transacción del RPC (atómica por RPC, sin hits REST) |

### 5.5 Estados de datos posteriores

| # | Caso | Resultado esperado |
|---|---|---|
| C21 | Reseña creada con `real_estate_id` vinculado | aparece asociada a la inmobiliaria; `real_estate_experience` coherente con lo elegido |
| C22 | Reseña creada por anon (deviation client) | RPC rechaza (requiere authenticated) |
| C23 | La reseña visible en `reviews_public.is_mine` | true para el autor; false para terceros |
| C24 | Auditoría: 1ra fila en `review_audit` | registrada por el trigger al momento del create |

## 6. Cobertura de los bordes en suites

| Nivel | Suite | Cubre bordes |
|---|---|---|
| Unit | `create-property-review.use-case.spec.ts` | rate limit id + scope, error del repo |
| Unit | `supabase-property-review-command.repository.test.ts` | firma RPC + rooms array real |
| E2E | `review-create-full.spec.ts` | flujo UI completo |
| Integración DB | `verify-services` asserts "create_review (A, RPC)…", "REST INSERT review_rooms bloqueado (F1)", `reviews_public.is_mine` | energía server-side con auth real |

## Referencias técnicas

- Presentation: `src/modules/property-reviews/presentation/review.actions.ts` (4 actions: create, update, delete, upload images)
- Use-case: `src/modules/property-reviews/application/commands/create-property-review.use-case.ts`
- Repository: `src/modules/property-reviews/infrastructure/repositories/supabase-property-review-command.repository.ts` (RPC `create_review`)
- Rate limit: `create-review:$userId` scope `write` (5/10s), definido en `src/lib/redis/rate-limit.ts`
- DB: RPC `create_review` — migración `003_functions_core.sql` (rate limit DB-side de update en `011_audit_fixes.sql`)
