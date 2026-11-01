# Testeo del flujo — Perfil (listados propios y eliminar cuenta)

> Flujo: página `/profile` con resumen del usuario, listados de reseñas propias, reseñas favoritas e inmobiliarias favoritas; y "Eliminar cuenta" (destructiva).

## Qué conecta con la migración

1. La sesión se lee hook client-side (`verifyAuthentication.hook.ts` → `SupabaseProfileAuthReadRepository` con `supabaseClient` explícito), pero **los datos** responden a las vistas RPC cuyo permissioning es el RLS — la UI solo refleja.
2. El middleware protege `/profile/**` (`middleware.ts`); sin sesión, redirección a login.
3. "Eliminar cuenta" es server action (`delete-account.actions.ts`) con rate limit `sensitive` 3/1h.

## 1. Resumen de perfil

1. Login → `/profile`.
2. ✅ Summary actualizado: count de reseñas, votos recibidos, inmobiliarias favoritas y reseñas favoritas.
3. Datos esperados de la sesión del middleware: nombre/avatar del metadata.

## 2. Listados

| Listado | Prueba esperada |
|---|---|
| "Mis reseñas" | incluye reviews escritas por mí; no incluye deleted (viene de `get_reviews_by_current_user`) |
| "Favoritas" | incluye favoritos marcados del usuario (**debe** reflejado el toggle de la guía [`favoritos.md`](./favoritos.md)); excluye favoritos de otros |
| Inmobiliarias favoritas | idem desde `getCurrentUserFavoriteRealEstates` |
| Otras reseñas de otros | NO appear en "mis reseñas" |

## 3. Eliminar cuenta

1. `/profile` → configuración → "Eliminar cuenta" → confirmación doble (destructiva).
2. ✅ Server action: aplica rate limit `delete-account:<userId>` scope `sensitive` (3/1h) antes de ejecutar el delete.
3. Post-delete: logout automático y no se puede re-loguear (el usuario auth fue borrado).
4. Data: filas de profile en cascada; el contenido del usuario queda según la política vigente (verificar el comportamiento del use-case antes de validar el flujo completo).
5. ⚠️ Testear rate limit cruzando con la ventana: la 4ª llamada en 1h falla por el limiter (recrear usuario para re-verificar).

## 4. Protección de ruta

- Modo incógnito: `/profile/**` → redirect `/login?redirectTo=/profile` (e2e: auth.spec).
- Logueado: acceso normal — e intentar `/login` con sesión activa redirige a `/` (middleware).

## 5. Cobertura en suites

| Nivel | Suite / comando | Cubre |
|---|---|---|
| Unit | hooks de `src/modules/profiles/presentation/__tests__/` (`getCurrentUserSummary`, `getCurrentUserReviews`, `getCurrentUserFavorite*`, `verifyAuthentication`) | contrato de los hooks |
| Unit | `delete-account.use-case.test.ts` | rate limit `delete-account:<user>` `sensitive` + flujo |
| Unit | `delete-account.actions.test.ts` | server action con deps |
| E2E | `e2e/specs/profile.spec.ts` | UI de perfil |
| E2E | `e2e/specs/account.spec.ts` | cuenta y logout |
| Integración DB | `pnpm test:services` §41 "listados del usuario actual": A ve su review, B no ve la de A, favoritos correctos por usuario | cierre del contrato de listados |

## 6. Casos borde y subflujos — exhaustiva (perfil)

### 6.1 Resumen y listados

| # | Caso | Resultado esperado |
|---|---|---|
| P1 | Usuario sin reseñas ni favoritos | summary en 0s, listados vacíos (sin skeleton infinito) |
| P2 | Summary consistente | counts reflejan DB (reviews propias, votos recibidos, favoritos) |
| P3 | Review propia soft-deleted | NO cuenta en el summary ⏳ ni aparece |
| P4 | Review de otro que me aparece como favorito | not "mis reseñas"; sí en favoritos |
| P5 | Review eliminada que había favoritado | fuera del listado ⏳ |
| P6 | Paginación de listados largos | slice correcto (sin duplicados por refetching) — hooks en el flight test |

### 6.2 Protección / sesión

| # | Caso | Resultado esperado |
|---|---|---|
| P7 | Anon → `/profile/subruta` | redirect login con `redirectTo` de la subruta |
| P8 | JWT válido pero profile borrado de la tabla | repos trata como nulo ⏳ — no crashea |
| P9 | Varios devices logueados | delete account en uno mato la sesión global (el JWT queda revocado) |

### 6.3 Eliminar cuenta

| # | Caso | Resultado esperado |
|---|---|---|
| P10 | Confirmación doble | solo 1 delete request |
| P11 | Rate limit: 2 deletes en 1h (usuario A) | 3ra en la hora rechazada por Redis `sensitive` |
| P12 | Delete con sesiones abiertas | todas revocadas |
| P13 | Re-login/email nuevo mismo email | cuenta nueva limpia (no recovery del viejo) |
| P14 | Contenido previo del borrado | según política vigente (verificar uso del use-case); reviews vw/other users should NOT break песión del detalle (friendly "usuario eliminado" si aplica) |

## Referencias técnicas

- Presentation: `src/modules/profiles/presentation/` (hooks `getCurrentUser*`, `verifyAuthentication.hook.ts`, `delete-account.actions.ts`)
- Use-cases: `delete-account.use-case.ts` (rate limit `sensitive`), agregaciones de summary
- Middleware guard: `middleware.ts` (`/profile/**`)
- DB: vistas RPCs de listados (`get_reviews_by_current_user`, `get_favorite_reviews_by_current_user`) — migración `011`
