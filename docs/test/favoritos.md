# Testeo del flujo — Favoritos (reseñas e inmobiliarias)

> Flujo: toggle de favoritos (`is_favorite`) para reseñas de direcciones y para inmobiliarias; accesibles en el perfil del usuario. Scope Redis `vote` (10/10s).

## Reglas de negocio (S2)

- No se puede favoritar el **propio** contenido (ver imports en verify-services: "A NO puede favoritar su propia ..."), tanto para reseñas como para inmobiliarias.
- Todo favorito se registra vía RPC (`toggle_favorite_review` / `toggle_favorite_real_estate`) con una única fila por par usuario-contenido.

## Prerequisitos

- 2 usuarios: **A** (contenido) y **B** (quien favoritea).

## 1. Manual — reseñas

1. B logueado → detalle de la reseña de A → icono de favorito / bookmark.
2. ✅ Toggle on: la reseña aparece en "Mis favoritos" del perfil de B.
3. DB: fila en `review_favorites` (review_id, user_id=B).
4. Re-click → toggle off: fila borrada, desaparece del listado.
5. A intenta favoritar la propia reseña → bloqueado (`success:false`, S2).
6. Tercero/**anon**: grant solo authenticated.

## 2. Manual — inmobiliarias

1. B → ficha de inmobiliaria de A → favorito.
2. ✅ fila en `real_estate_favorites`; `is_real_estate_favorite` para B devuelve `true`.
3. A intenta favoritar su propia inmobiliaria → bloqueado S2 (verify-services assert).
4. Toggle off → fila borrada.

## 3. Reflejo en el perfil (listados)

| Verificación | Esperado |
|---|---|
| `get_favorite_reviews_by_current_user` para B | incluye la reseña favoritada; **no** incluye las полüticas de A |
| `getCurrentUserFavoriteRealEstates` hook | idem para inmobiliarias |
| Listados propios de cada quien | mismo contrato para la composición del perfil (A no ve los favoritos de B) |

## 4. Rate limit

Key: `favorite-review:<userId>` / `favorite-real-estate:<userId>` — scope `vote` (10/10s). Verificación: 11 toggles rápidos → la 11ª rechazada por Redis, toast correspondiente.

## 5. Cobertura en suites

| Nivel | Suite / comando | Cubre |
|---|---|---|
| Unit | `toggle-favorite-property-review.use-case.spec.ts` | rate limit `favorite-review:<id>` `vote`, use-case |
| Unit | `toggle-favorite-real-estate.use-case.spec.ts` | idem `favorite-real-estate` |
| Unit | hooks (`isRealEstateFavorite`, `useIsReviewFavorite`, `getCurrentUserFavorite*`) | estado de favoritos en la UI |
| E2E | `e2e/specs/review-detail.spec.ts` — "marca y desmarca favorito" | toggle en UI |
| E2E | `e2e/specs/profile.spec.ts` | favoritos visibles en perfil |
| Integración DB | `pnpm test:services` §"FAVORITOS": toggle favorito (S2 self bloqueado), toggle favorito ajeno, `is_*_favorite` true tras toggle | reglas server-side reales |

## 6. Casos borde y subflujos — exhaustiva (favoritos)

### 6.1 Toggle / idempotencia

| # | Caso | Resultado esperado |
|---|---|---|
| F1 | Favoritar + re-click | toggle on→off: fila borrada de DB |
| F2 | Doble click rápido (2 server action submissions) | la 2da alterna accidentalmente ⏳ — verificar guard `isPending` del botón |
| F3 | Favoritar y refrescar | estado persistido; icono marcado |
| F4 | Favoritos sobre contenido ya votado | independiente: voto y favorito son subflows separados (keys `vote-review` vs `favorite-review`) |

### 6.2 Permisos

| # | Caso | Resultado esperado |
|---|---|---|
| F5 | Favoritar reseña propia | bloqueado (S2) |
| F6 | Favoritar inmobiliaria propia | bloqueado (S2) |
| F7 | Anon | bloqueado (grant authenticated) |
| F8 | ID inexistente / fake uuid | RPC rechaza |

### 6.3 Estados de datos

| # | Caso | Resultado esperado |
|---|---|---|
| F9 | Contenido favoritado luego soft-deleted por su autor | el favorito del tercero queda huérfano ⏳ — el listado debe excluirlo |
| F10 | Contenido favoritado, luego soft-deleted por su autor | el listado de favoritos deja de listar ese contenido |
| F11 | `is_*_favorite` del dueño | siempre false (lo bloquea el self-favorite S2) |

### 6.4 Rate limit y listado

| # | Caso | Resultado esperado |
|---|---|---|
| F12 | 10 toggles en < 10s | ok |
| F13 | 11to en la ventana | rechazo Redis `vote` scope |
| F14 | Favoritos cruzados (2 usuarios favoritan) | cada una tiene su listado — verify-services "A no ve los favoritos de B" |

## Referencias técnicas

- Actions: `src/modules/property-reviews/presentation/review-interactions.actions.ts` (`toggleFavoriteReviewAction`), `src/modules/real-estates/presentation/real-estate-interactions.actions.ts`
- Use-cases: `toggle-favorite-property-review.use-case.ts`, `toggle-favorite-real-estate.use-case.ts`
- DB: RPCs `toggle_favorite_review` / `toggle_favorite_real_estate` + vistas `_public`; grants solo authenticated
