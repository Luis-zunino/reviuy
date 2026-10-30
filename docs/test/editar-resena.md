# Testeo del flujo — Editar y eliminar reseña

> Flujo: el autor edita título/descripción/rating/rooms de su reseña, sube imágenes o la elimina (soft-delete). Todo vía server action sobre los RPCs `update_review` / `delete_review_safe`.

## Qué cambió en la migración (regresiones a vigilar)

1. **🔥 Fix crítico de rooms:** `update_review` ahora recibe `p_review_rooms` como **array jsonb real** y los rooms se reemplazan atómicamente dentro del RPC. Antes el update mandaba un string (`structuredClone(JSON.stringify(...))`), el RPC rechazaba todo con `jsonb_typeof <> 'array'` y la edición entera estaba rota, aparte de haber writes REST sueltos a `review_rooms`.
2. El update usa un **solo RPC** (ya no hay delete + insert REST de rooms aparte) → testear que no queden rooms huérfanos ni duplicados.
3. Rate limit en el server: `update-review:<userId>` scope `write` (5/10s), `delete-review:<userId>` `write`, `upload_review_image:<userId>` `write`.
4. Además existe un **rate limit DB-side** del RPC `update_review` (10 cambios/60s) — un segundo guard independiente del Redis.

## Prerequisitos

- Una reseña **propia** existente (crearla con la guía [`crear-resena.md`](./crear-resena.md)).
- Usuario logueado.

## 1. Edición — happy path manual

1. Entrar a la reseña propia → "Editar".
2. Cambiar título y rating; **reemplazar rooms** (sacar uno, agregar otro con distinta area).
3. Guardar.
4. ✅ Success; volver al detalle:
   - Título/rating actualizados.
   - `review_rooms` en DB: exactamente los rooms nuevos (sin los viejos, sin duplicados).
   - `review_audit` con la fila del cambio (trigger `log_review_changes`).
5. Reindexar/revalidar la página (`revalidatePath`): actualizar F5 y confirmar que la vista muestra el update (no cache stale).

## 2. Eliminación (soft-delete)

1. Detalle de reseña propia → "Eliminar" → confirmar.
2. ✅ Success; la reseña desaparece de listados y detalle.
3. DB: la fila sigue existiendo con `deleted_at` seteado (soft delete with audit) — `select deleted_at from reviews where id=...`.
4. La reseña eliminada ya NO aparece en `reviews_public` ni en `get_reviews_by_current_user`.

## 3. Fail paths

| Situación | Resultado esperado |
|---|---|
| Editar reseña de **otro** usuario (forzando `review_id` ajeno por DevTools) | RPC rechaza (guard `auth.uid() = user_id`) → error, sin writes |
| 6ª edición en < 10s | rechazada por Redis `write` — toast, no modifica |
| 11ª edición dentro de 60s | rechazada por el rate limit del propio RPC `update_review` (10/60) |
| Otra ventana: filtrar texto ofensivo vía bad-words | rechazo de validación |
| Al fallar el RPC (`success:false`) | la action lanza → toast de error, la UI no queda "guardando" colgada |

## 4. Imágenes de reseña

1. Con la review abierta, subir imagen (`review-images.actions.ts`).
2. Rate: `upload_review_image:<user>` `write` 5/10s.
3. DB: fila en `review_images` (REST insert **permitido** con grant para owner — F4), ficha en storage con el path correspondiente.

## 5. Cobertura en suites

| Nivel | Suite / comando | Qué cubre |
|---|---|---|
| Unit | `update-property-review.use-case.spec.ts` | rate limit `update-review:<id>` `write`, flujo del use-case |
| Unit | `supabase-property-review-command.repository.test.ts` | 🔥 firma del RPC: `p_review_rooms` **array** (no string), `success:false` → throw `VALIDATION_ERROR` |
| Unit | `delete-property-review.use-case.spec.ts` | rate limit delete + flujo |
| E2E | `e2e/specs/review-edit.spec.ts` | edición desde la UI |
| Integración DB | `pnpm test:services` → "update_review con rooms (A) — fix rooms string" | 🔥 update con rooms **array jsonb real** contra DB de staging |
| Integración DB | `pnpm test:services` → "rate limit update_review (10/60): 10 OK y la 11ra rechazada" | el guard DB-side del RPC |
| Integración DB | cleanup → "reviews (delete_review_safe)" | soft delete auditado |

## 6. Casos borde y subflujos — exhaustiva (editar / eliminar)

### 6.1 Validaciones de entrada

| # | Caso | Resultado esperado |
|---|---|---|
| E1 | Cambiar rooms: agregar, quitar y mezclar | el RPC reemplaza el set completo (no hace appends ni deja viejos) |
| E2 | Rooms vacíos al editar | limpia todos los rooms ⏳ (confirmar que `null` ≠ `[]` en el RPC) |
| E3 | Solo título (sin tocar el resto) | rating y rooms quedan intactos |
| E4 | Campos enviados `undefined` | el update no los pisa |
| E5 | Rating fuera de rango | rechazo por constraint |
| E6 | Texto ofensivo | rechazo bad-words igual que en create |

### 6.2 Permisos (ataques)

| # | Caso | Resultado esperado |
|---|---|---|
| E7 | Editar reseña **ajena** (id ajeno via DevTools) | RPC rechaza (`auth.uid() = user_id`) → error, sin writes |
| E8 | Eliminar reseña ajena (verificación server) | bloqueado (verify-services: `delete_real_estate_review_safe` B bloqueado) |
| E9 | Editar/eliminar reseña ya soft-deleted | rechazada — ⏳ confirmar que el RPC filtra `deleted_at` |
| E10 | Resurrection via REST a `reviews` | bloqueado: REST writes denegados (S2) |

### 6.3 Rate limits — doble guardia (Redis + RPC)

| # | Caso | Resultado esperado |
|---|---|---|
| E11 | 5 updates en < 10s por usuario | ok (Redis `write`, key `update-review:<user>`) |
| E12 | 6ta update dentro de la ventana Redis | rechazo con toast |
| E13 | 11 updates dentro de 60s (ventanas Redis vendidas) | la 11ª rechazada por el rate limit del propio RPC `update_review` (10/60) |
| E14 | Delete + re-create rápido | keys distintas (`delete-review` vs `create-review`): límites independientes |

### 6.4 Imágenes (subflujo)

| # | Caso | Resultado esperado |
|---|---|---|
| E15 | Subir imagen a la reseña propia | permitido (grant insert `review_images` con RLS de owner — F4) |
| E16 | Insert REST de imagen para reseña ajena | rechazado por RLS |
| E17 | 6 uploads en < 10s | la 6ta rechazada por Redis `write` (`upload_review_image:<user>`) |
| E18 | URL/path arbitrario | el schema valida — ⏳ confirmar reglas de shape |

### 6.5 Eliminación y estados de datos

| # | Caso | Resultado esperado |
|---|---|---|
| E19 | Soft-delete de la propia | fila persiste con `deleted_at`; desaparece de listados y de `reviews_public` |
| E20 | `get_reviews_by_current_user` post-delete | la review soft-deleted no vuelve (assert verify-services) |
| E21 | Audit por update | cada cambio genera fila en `review_audit` (trigger `log_review_changes`) |
| E22 | Cache stale tras update | `revalidatePath` refresca detalle y listado |

## Referencias técnicas

- Presentation: `src/modules/property-reviews/presentation/review.actions.ts` (`updateReviewAction`, `deleteReviewAction`)
- Repository: `supabase-property-review-command.repository.ts` — `update()` (firma con `p_review_rooms` array real) y `delete()` (`delete_review_safe`)
- DB: RPC `update_review` (rooms atómicos + rate limit 10/60), `delete_review_safe` (soft-delete auditado) — migraciones `003/004/011`
- Audit: trigger `log_review_changes` → tabla `review_audit`
