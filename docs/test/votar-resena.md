# Testeo del flujo — Votar reseña (likes / dislikes)

> Flujo: usuarios votan (like/dislike/toggle) reseñas de direcciones de terceros. Vía server action `voteReviewAction` sobre el RPC `vote_review`.

## Qué cambió en la migración (regresiones a vigilar)

1. **🔥 Rechazos de negocio ahora explotan:** el repository chequea `success === false` del RPC y lanza `VALIDATION_ERROR` → la UI muestra el toast correcto. Antes devolvía `success:true` a ciegas y la UI quedaba colgada sin feedback.
2. **Anti-self-vote en UI:** en la reseña propia los botones de voto **no se renderizan** (`review.is_mine`) — `ReviewSummary/index.tsx` y `RealEstateReviewForm`. Antes se mostraban y el voto fallaba en silencio (M4).
3. Rate limit server-side: `vote-review:<userId>` scope `vote` 10/10s (por usuario).

## Regla de negocio central (M4)

```
auth.uid() ≠ review.user_id   →   permitido (create/update vote)
auth.uid() = review.user_id   →   bloqueado (success:false "No podés votar tu propia reseña")
anon                           →   bloqueado (grant solo authenticated)
```

## Prerequisitos

- 2 usuarios de prueba: **A** (autor de una reseña) y **B** (un votante).
- La reseña de A ya creada ([`crear-resena.md`](./crear-resena.md)).

## 1. Voto de tercero — happy path

1. Loguear usuario B → abrir la reseña de A (`/review/<id>/details`).
2. Click "Marcar como útil".
3. ✅ Contador de likes +1; botón pasa a estado "Ya votaste útil".
4. DB: fila en `review_votes` (review_id, user_id=B, vote_type=like).
5. **Toggle:** re-click "Ya votaste útil" → se quita el voto (contador −1, fila borrada en DB).
6. Cambiar de like a dislike: si ya había un voto y se vota el otro, se **reemplaza** (no se crean 2 filas — unique constraint user_id+review_id).

## 2. Anti-self-vote

1. Loguear usuario A → abrir su propia reseña.
2. ✅ 🔥 **No** existen botones "Marcar como útil" / "Marcar como no útil" en la página (regresión: si aparecen, el fix de UI se perdió).
3. Defensa en profundidad (aunque la UI no muestre): B/A forzando el voto por DevTools contra la action → la respuesta es el rechazo del RPC y **la UI muestra el toast** de error (no silencio).
4. Por REST directo a `vote_review` con el JWT de A: `success:false` — mismo resultado que asierta el assert de `pnpm test:services`.

## 3. Éxitos/fails del flujo (matriz)

| Situación | Resultado esperado |
|---|---|
| Voto like sobre reseña ajena | +1 like, fila única `review_votes` |
| Voto igual de nuevo (toggle out) | contador −1, fila borrada |
| Voto distinto al previo | replace (1 fila, vote_type cambia) |
| Voto sobre reseña propia | bloqueado M4 + toast en server action |
| Voto de anon | bloqueado: grant solo authenticated (verify-services assert) |
| 11 votos en < 10s | el 11º rechazado por Redis `vote` scope |
| `updated_at` en DB al cambiar el voto | pisado por el **trigger BEFORE UPDATE** (M6) — regresión probada por verify-services |

## 4. Votos contabilizados (integración)

- Tras el voto de B: `get_review_vote_counts` devuelve `likes_count=1` (verificado en verify-services).
- La columna visible de la vista (`reviews_with_votes_public`) refleja los counts; verificar que la vista **no expone** `user_id` (assert de identidad en verify-services) y que `likes` llegó al detalle de la reseña.

## 5. Cobertura en suites

| Nivel | Suite / comando | Qué cubre |
|---|---|---|
| Unit | `vote-property-review.use-case.spec.ts` | rate limit `vote-review:<id>` `vote`, flujo del use-case |
| Unit | `supabase-property-review-command.repository.test.ts` (`describe('vote')`) | 🔥 `success:false` → throw (funcionalidad del fix) |
| Unit | `getUserReviewVote.hook.test.ts` | el estado del voto propio en la UI |
| E2E | `e2e/specs/review-detail.spec.ts` — "no permite votar una reseña propia (botones ocultos)" | 🔥 los visitados **no** se renderizan para el owner |
| Integración DB | `pnpm test:services` → "vote_review: A NO puede votar su propia review (M4)" / "B vota review ajena (like) — OK" | reglas M4 contra DB real |
| Integración DB | "trigger BEFORE UPDATE pisa el centinela de updated_at (M6)" + "get_review_vote_counts refleja el voto de B" | anti-regresión de contadores y audit |

## 6. Casos borde y subflujos — exhaustiva (votar)

### 6.1 Permisos y auth

| # | Caso | Resultado esperado |
|---|---|---|
| V1 | Vote sobre reseña propia (UI) | 🔥 botones ni se renderizan (`is_mine`) |
| V2 | Vote sobre reseña propia vía action (DevTools) | RPC `success:false` → ahora la UI muestra error (regresión del fix) |
| V3 | Anon votando | bloqueado: grant solo authenticated |
| V4 | JWT válido pero user borrado | `getUser` null → UNAUTHORIZED de la action |
| V5 | `review_id` inexistente | RPC rechaza (no crashea UI) |

### 6.2 Estados de la reseña

| # | Caso | Resultado esperado |
|---|---|---|
| V6 | Votar reseña ya soft-deleted | rechazo del RPC — ⏳ confirmar filtro `deleted_at` |
| V7 | Voto sobre reseña reportada | permitido (el report no la oculta para otros) — ⏳ |
| V8 | Vista de detalle de la reseña propia (compartiendo la URL a otra persona no cambia nada) | el dueño tampoco ve botones en el detalle |

### 6.3 Toggle / reemplazo

| # | Caso | Resultado esperado |
|---|---|---|
| V9 | Votar like en review sin voto previo | +1 like, fila nueva |
| V10 | Votar like dos veces (toggle in/out) | la 2da revierte (fila borrada), contador regresa |
| V11 | Votar dislike tras like | reemplazo: 1 fila sola, `vote_type` cambia |
| V12 | Re-click rápido (doble submit) | el guard `isPending` de la server action evita toggles accidentales — ⏳ verificar retry UX |
| V13 | Voto + reencuentro (recargar) | estado persistente: "Ya votaste useful" sigue |

### 6.4 Rate limits

| # | Caso | Resultado esperado |
|---|---|---|
| V14 | 10 votos en < 10s (misma key `vote-review:<user>`) | ok |
| V15 | 11vo voto en la ventana | rechazo Redis — toast |
| V16 | Votos + favoritos: keys distintas (`vote-review` vs `favorite-review`) | límites independientes aunque compartan scope `vote` |

### 6.5 Contadores y consistencia

| # | Caso | Resultado esperado |
|---|---|---|
| V17 | Counts tras un cambio de voto | `get_review_vote_counts` refleja el estado neto (swap like↔dislike incluido) |
| V18 | Vista `reviews_with_votes_public` no filtra identidad | sin columnas `user_id/created_by` (assert identity) |
| V19 | Concurrency: 2 users votando igual simultáneamente | ambos insertan; counts netos correctos (unique por usuario) |
| V20 | `updated_at` tras update | reel trigger `M6` pisa el valor (no estampa DEFAULT only) |

## Referencias técnicas

- Presentation: `src/modules/property-reviews/presentation/review-interactions.actions.ts` (`voteReviewAction`, `toggleFavoriteReviewAction`)
- Use-case: `vote-property-review.use-case.ts` (rate limit `vote-review:<id>` scope `vote`)
- Repository: `supabase-property-review-command.repository.ts` → `vote()` (RPC `vote_review`; check `success:false` → `VALIDATION_ERROR`)
- UI: `ReviewSummary/index.tsx` (guard `is_mine`), hook `useUserReviewVote`
- DB: RPC `vote_review` + trigger `updated_at` de `review_votes` (M6, migración `005_triggers.sql` + `011`)
