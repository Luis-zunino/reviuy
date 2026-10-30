# Guías de testeo por flujo — coalición post-migración server-side

> Carpeta de guías para testear **cada flujo de la app** (login, reseñas, votos, reportes, etc.) después de la migración de auth/server actions al side servidor.
>
> Cada guía incluye: qué cambió en la migración, prerequisitos, pasos manuales, qué verificar (toasts, redirects, rate limits), y en qué suite confiar (unit Vitest / e2e Playwright / script `verify-services`).
>
> Setup y prerequisitos generales del entorno: `../12-testing-migracion-auth.md`.

## Índice

| Archivo | Flujo | Rate limit aplicado |
|---|---|---|
| [`login.md`](./login.md) | Login magic link, Google, callback, términos, logout | `auth_email` 5/min · `auth_oauth` 10/min por IP |
| [`crear-resena.md`](./crear-resena.md) | Crear reseña de dirección (con rooms) | `create-review:<user>` scope `write` 5/10s |
| [`editar-resena.md`](./editar-resena.md) | Editar/eliminar reseña, rooms, imágenes | `update-review` / `delete-review` / `upload_review_image` scope `write` |
| [`votar-resena.md`](./votar-resena.md) | Likes/dislikes + favoritos de reseñas | `vote-review` / `favorite-review` scope `vote` 10/10s |
| [`reportar.md`](./reportar.md) | Reportes de reseñas/inmobiliarias | `report-*` scope `sensitive` 3/1h |
| [`inmobiliarias.md`](./inmobiliarias.md) | Crear inmobiliaria, reseña de inmobiliaria, votar, reportar | `*(create|update|delete)-re-review:<user>` `write` · `vote-*` `vote` |
| [`favoritos.md`](./favoritos.md) | Favoritos de reseñas y de inmobiliarias | scope `vote` |
| [`perfil.md`](./perfil.md) | Perfil, listados propios/favoritos, eliminar cuenta | `delete-account:<user>` scope `sensitive` 3/1h |

## Cómo usar estas guías

1. **Unitario primero:** toda la capa server actions/use-cases tiene cobertura Vitest.
2. **E2E en segundo lugar:** cada guía lista el spec Playwright de su flujo.
3. **Verificación contra DB real:** `pnpm test:services` ejecuta los mismos RPCs de la app con usuarios reales (A y B) y asegura reglas de negocio server-side (self-vote bloqueado, rate limits RPC, cleanup, audit). Contar con `./README.md`: `pnpm test:services` limpia la data.
4. **Manual por último:** pasos UI con los toasts/redirects cuyo detalle no captura ninguna suite.

## Límites de rate (firmas para referencia rápida)

| Escala | Limiter | Ventana | Usado por |
|---|---|---|---|
| `write` | 5 | 10 s | create/update/delete review, inmobiliarias, upload imagen |
| `vote` | 10 | 10 s | votes + favoritos (reseñas e inmobiliarias) |
| `sensitive` | 3 | 1 h | reportes, contacto, eliminar cuenta |
| `auth_email` | 5 | 1 m | envío de magic link |
| `auth_oauth` | 10 | 1 m | inicio OAuth de Google (por IP) |

Definidos en `src/lib/redis/rate-limit.ts`; keys por flow en cada use-case de `src/modules/*/application/commands/`.

## Convención de apuntes en estos docs

- ✅ resultado esperado exacto
- ⚠️ gotcha conocido
- 🔥 regresión a vigilar (break de PR)
- ⏳ comportamiento a verificar contra el código/DB (puede no estar 100% confirmado al escribir la guía)

Cada guía tiene su sección de **casos borde y subflujos** numerados (L=login, C=crear, E=editar, V=votar, R=reportar, I=inmobiliarias, F=favoritos, P=perfil): son la checklist exhaustiva a recorrer en la sesiones de QA; los ⏳ van bajando a ✅ a medida que se confirma su comportamiento real.
