# Testeo del flujo — Inmobiliarias (crear, reseñar, votar, reportar)

> Flujo: crear inmobiliaria, escribir reseña de inmobiliaria, votar (likes de inmobiliaria y de su reseña), reportar. Vistas y endpoints con `_public` y guardas `is_mine`.

## Qué cambió en la migración a vigilar en este flujo

1. **🔥 `success:false` del RPC ahora se respete:** los repos de voto lanzan `VALIDATION_ERROR` — antes quedaba la UI sin feedback. (repo `real-estate-command.repository.ts`)
2. La vista se renombró `_with_votes` → `_public` y **no expone identidad**; los selects también piden `is_mine` (usado por el guard de voto en la UI). Los types ya apuntan a las vistas nuevas en `real-estate.types.ts`.
3. Todo emite por RPC: si aparecen writes REST sueltos a votos/reportes es una regresión (los grants bloquean directo).

## Prerequisitos

- 2 usuarios: **A** (propietario del contenido) y **B** (votante/reportante).

## 1. Crear inmobiliaria

1. Con A: UI → crear inmobiliaria (nombre + descripción).
2. ✅ Devuelve `id` (`success:true`); la fila aparece en `real_estates_public` para terceros.
3. Rate: `create-real-estate:<userId>` scope `write` (5/10s).

## 2. Votar inmobiliaria (M4)

| # | Acción | Resultado esperado |
|---|---|---|
| 1 | B vota `like` la inmobiliaria de A | fila en `real_estate_votes`, counts reflejan 1 |
| 2 | B re-vota no útil (cambio) | **reemplaza** el voto (única fila por user+target) |
| 3 | A intenta votar la suya | bloqueado (`success:false`, M4) — y la UI también oculta el botón (`is_mine`) |
| 4 | Anon | bloqueado (grant solo authenticated) |
| 5 | Toggle out (B deshace) | fila borrada, counts en 0 |

## 3. Reseña de inmobiliaria

1. A crea reseña de su propia inmobiliaria (`create_real_estate_review`).
2. ✅ Success: fila `real_estate_reviews`, rate limit `create-re-review:<userId>` `write`.
3. A **edita** la reseña (`update_real_estate_review`) → ✅ success (rate `update-re-review` volvería a `write`).
4. B vota la reseña de A (`vote_real_estate_review`) → ✅; A vota la suya → bloqueado M4 (rate `vote-re-review` scope `vote`).
5. Counts: `get_real_estate_review_vote_counts` → like=1 tras el voto de B.

## 4. Reportar

- B reporta la inmobiliaria de A (`report_real_estate`) → ✅; A reporta la suya → bloqueado (M3).
- B reporta la **reseña** de inmobiliaria de A → ✅; doble reporte → unique.
- Rates: `report-real-estate:<user>` / `report-real-estate-review:<user>` scope `sensitive` 3/1h.

## 5. Lectura pública y privacidad (identidad)

- La vista `real_estates_public` y `real_estate_reviews_with_votes_public`: selecciones de B **nunca** incluyen `user_id`/`created_by` (assert de identidad de columnas).
- GET por id/listado devuelve `is_mine` correcto por sesión (true para el owner, false para terceros, undefined para anon).
- Anon: los RPC paginados funcionan pero el REST sobre tablas de negocio está bloqueado.

## 6. Cobertura en suites

| Nivel | Suite / comando | Cubre |
|---|---|---|
| Unit | `supabase-real-estate-command.repository.test.ts` (describe `vote`) | 🔥 `success:false` → throw |
| Unit | `create-real-estate.use-case.spec.ts` (+ create-re-review, vote-re, vote-real-estate, toggle-favorite, delete-re) | rate limits + flujo |
| E2E | `e2e/specs/real-estate.spec.ts` | UI del flujo |
| Integración DB | `pnpm test:services` §"REAL ESTATE": create, self-vote bloqueado, vote ajeno OK, counts, self-report, report ajeno; §"REAL ESTATE REVIEW": create/update/vote/counts/report; REST tablas bloqueado | guía manual anterior cuando se honora esta suite |

## 7. Casos borde y subflujos — exhaustiva (inmobiliarias)

### 7.1 Creación

| # | Caso | Resultado esperado |
|---|---|---|
| I1 | Nombre vacío / demasiado largo | zod schema rechaza |
| I2 | Nombre duplicado (otra inmobiliaria existente) | permitido salvo unique — ⏳ verificar constraint |
| I3 | Emoji/unicode en nombre y descripción | soportado (UTF8) ⏳ |
| I4 | 6 creaciones en < 10s | la 6ta rechazada Redis `write` (`create-real-estate:<user>`) |

### 7.2 Votos de inmobiliaria

| # | Caso | Resultado esperado |
|---|---|---|
| I5 | B vota la de A | +1; counts refleja |
| I6 | Cambio de voto (like↔dislike) | replace: una fila por user+target |
| I7 | Toggle out | contador baja, fila borrada |
| I8 | A vota la propia (UI) | botón oculto (`is_mine`) 🔥 |
| I9 | A vota la propia (action forzada) | `success:false` → THROW → toast (fijo) |
| I10 | Anon | bloqueado |
| I11 | ID inexistente | RPC rechaza |

### 7.3 Reseñas de inmobiliaria (subflujo completo)

| # | Caso | Resultado esperado |
|---|---|---|
| I12 | A crea reseña **de su propia inmobiliaria** | PERMITIDO (a diferencia de favoritos/self-vote — dueño reseña su RE) ⏳ confirmar contra assert |
| I13 | B crea reseña de la inmobiliaria de A | PERMITIDO (cualquier authenticated) |
| I14 | A edita su RE review | success (rate `update-re-review` `write`) |
| I15 | B edita la RE review de A | rechazo (`auth.uid() = user_id`) |
| I16 | B vota la reseña de A | ok; A vota su propia reseña → bloqueado M4 |
| I17 | B elimina la RE review de A | bloqueado (`delete_real_estate_review_safe`); A elimina suya → soft-delete |
| I18 | RE review soft-deleted | desaparece de `real_estate_reviews_public` (assert) |

### 7.4 Lectura / privacidad

| # | Caso | Resultado esperado |
|---|---|---|
| I19 | Anon sobre vistas `_public` | lectura ok; REST sobre tablas bloqueado |
| I20 | `is_mine` por sesión | true owner / false terceros |
| I21 | Columnas de identidad (`user_id/created_by`) | nunca aparecen en `_public` |
| I22 | `get_real_estates_paginated` incluye la nueva RE | tanto auth como anon (assert) |

### 7.5 Reportes (referencia)

| # | Caso | Resultado esperado |
|---|---|---|
| I23 | B reporta RE de A | ok (`report_real_estate` + audit) |
| I24 | A reporta la propia / double | bloqueado M3 + unique |
| I25 | RE review reporte doble | unique |

## Referencias técnicas

- Actions: `src/modules/real-estates/presentation/real-estate.actions.ts` (create real estate), `real-estate-review.actions.ts` (reseñas), `real-estate-interactions.actions.ts` (vote/report/favorite)
- Use-cases: `application/commands/*` de real-estates (rate limits por flow)
- Repository: `supabase-real-estate-command.repository.ts` (checks `success:false`), `supabase-real-estate-read.repository.ts` (selects con `is_mine`)
- Types: `real-estates/domain/contracts/real-estate.types.ts` (vistas `_public`)
- DB: RPCs `create_real_estate`, `vote_real_estate`, `report_real_estate`, `create/update/vote/report_real_estate_review` (migraciones `003/011/014`)
