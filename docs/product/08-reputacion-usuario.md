# Flujo 08 — Reputación y puntaje de usuario

## Propósito

Implementar un sistema de reputación (karma) que puntúe a los usuarios según su contribución y aceptación comunitaria. El score sirve como **señal de confianza**: cuando un lector ve una reseña, el puntaje del autor le indica si esa persona tiene trayectoría en la plataforma.

## Contexto actual

ReviUy ya tiene toda la infraestructura para esto:

| Componente existente | Cómo ayuda |
|---|---|
| Tablas `review_votes`, `real_estate_votes`, `real_estate_review_votes` | Contienen los likes/dislikes que ya se dan |
| Vistas materializadas `*_vote_stats` | Ya cachean contadores de votos por entidad |
| Función `refresh_all_vote_stats()` | Ya refresca las vistas materializadas |
| RLS que impide self-voting | Ya protege contra manipulación básica |
| Rate limiting + detección de actividad sospechosa | Ya mitiga abuso |
| Módulo `profiles` activo | Ya maneja el perfil del usuario |

**No existe**: tabla de reputación, función de cálculo de score, ni UI de badges/leaderboard.

## Alcance del feature

### Lo que se construye

1. **Backend (DB)**
   - Tabla `user_reputation` con score, contadores y desglose
   - Función `calculate_user_reputation(user_id)` — fórmula de cálculo
   - Triggers que actualicen el score ante eventos de votos y reseñas
   - RPC `get_user_reputation(user_id)` — lectura del score
   - Vista `user_reputation_leaderboard` — top usuarios
   - Script de backfill para usuarios existentes
   - Migración de la tabla + RLS

2. **Frontend**
   - Badge de reputación en el perfil del usuario
   - Score visible junto al autor en cada reseña
   - Panel de desglose en el dashboard del propio usuario
   - Página de leaderboard (top contributors)

3. **Tests**
   - Tests RLS para la nueva tabla
   - Tests de la función de cálculo
   - Tests E2E del leaderboard y badges

### Lo que NO se construye (por ahora)

- Niveles o badges temáticos ("Reseñador Expert", "Top Contributor") — futura iteración
- Gamificación con recompensas o beneficios tangibles
- Score de inmobiliarias (ya tienen `rating` promedio)

## Fórmula de score (propuesta — requiere validación)

```
score = (reseñas_creadas × 10) + (likes_recibidos × 5) - (dislikes_recibidos × 3)
```

| Factor | Peso | Justificación |
|---|---|---|
| Reseña creada | +10 | Contribución primaria; el usuario genera contenido valioso |
| Like recibido | +5 | La comunidad validó la reseña como útil |
| Dislike recibido | -3 | La comunidad indicó que la reseña no es útil (penalización menor para no desincentivar) |

**Preguntas abiertas sobre la fórmula:**
- ¿Los pesos son correctos o se ajustan?
- ¿Se aplica techo (max score)?
- ¿El score puede ser negativo?
- ¿Se pondera por antigüedad (bonus por antigüedad en la plataforma)?

## Criterios de aceptación

### Backend

- [ ] La tabla `user_reputation` existe con columnas: `user_id`, `score`, `contributions_count`, `received_likes`, `received_dislikes`, `breakdown` (JSONB), `updated_at`
- [ ] La función `calculate_user_reputation(user_id)` retorna el score calculado
- [ ] Al crear una reseña → `contributions_count` incrementa +1 y `score` se actualiza
- [ ] Al eliminar una reseña → `contributions_count` decrementa -1 y `score` se actualiza
- [ ] Al votar una reseña → `received_likes` o `received_dislikes` se actualiza y `score` se recalcula
- [ ] Al eliminar un voto → el contador correspondiente se decrementa
- [ ] El RPC `get_user_reputation(user_id)` retorna score y desglose
- [ ] La vista `user_reputation_leaderboard` retorna top usuarios ordenados por score
- [ ] RLS: score visible públicamente; `breakdown` solo para el propio usuario y admins
- [ ] Script de backfill calcula el score histórico para todos los usuarios existentes
- [ ] Los triggers no degradan el rendimiento de INSERT/UPDATE en `reviews` y `review_votes`

### Frontend

- [ ] Badge de reputación visible en el perfil del usuario
- [ ] Score visible junto al nombre del autor en cada reseña (detalle y listado)
- [ ] Panel en dashboard mostrando score propio y desglose (contribuciones, likes recibidos, dislikes recibidos)
- [ ] Página `/leaderboard` con top usuarios por score
- [ ] Loading states y estados vacíos manejados correctamente
- [ ] Responsive: funciona en mobile y desktop

### Tests

- [ ] Tests RLS: usuario autenticado puede leer su propio score; anónimo puede leer scores públicos; nadie puede modificar `user_reputation` directamente
- [ ] Tests de la función de cálculo con casos edge (sin reseñas, solo likes, solo dislikes, mixto)
- [ ] Test E2E: crear reseña → votarla → verificar que el score del autor se actualiza
- [ ] Test E2E: leaderboard muestra usuarios ordenados correctamente

## Estructura propuesta de la tabla

```sql
CREATE TABLE user_reputation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  contributions_count INTEGER NOT NULL DEFAULT 0,
  received_likes INTEGER NOT NULL DEFAULT 0,
  received_dislikes INTEGER NOT NULL DEFAULT 0,
  breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE user_reputation ENABLE ROW LEVEL SECURITY;

-- Lectura pública (cualquiera puede ver scores)
CREATE POLICY "user_reputation_select_public"
  ON user_reputation FOR SELECT
  USING (true);

-- Solo system puede escribir (via RPC/triggers SECURITY DEFINER)
CREATE POLICY "user_reputation_insert_system"
  ON user_reputation FOR INSERT
  WITH CHECK (false);

CREATE POLICY "user_reputation_update_system"
  ON user_reputation FOR UPDATE
  USING (false);
```

## Dependencias

| Dependencia | Estado | Riesgo si no existe |
|---|---|---|
| Tabla `reviews` | ✅ Existe | — |
| Tabla `review_votes` | ✅ Existe | — |
| Tabla `real_estate_reviews` | ✅ Existe | — |
| Tabla `real_estate_review_votes` | ✅ Existe | — |
| Vista `review_vote_stats` | ✅ Existe | — |
| Función `refresh_all_vote_stats()` | ✅ Existe | — |
| RLS anti-self-voting | ✅ Existe | — |
| Módulo `profiles` | ✅ Activo | — |

**No hay dependencias bloqueantes.** Todo lo necesario ya está implementado.

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Backfill de datos históricos toma mucho tiempo | Media | Bajo | Ejecutar en ventana de bajo tráfico; la tabla es nueva, no bloquea reads |
| Triggers añaden latencia a INSERT/UPDATE de votos | Baja | Medio | El cálculo es aritmético simple; medir antes/después |
| Fórmula de score no es percibida como justa por usuarios | Media | Medio | Hacer configurable; permitir ajustar pesos sin redeploy |
| Self-voting rings (usuarios falsos se votan entre sí) | Baja | Alto | Ya existe rate limiting + detección de actividad sospechosa |
| Score negativo desincentiva a nuevos usuarios | Media | Bajo | Piso en 0, o bonus inicial para nuevos usuarios |

## Impacto por capa técnica

| Capa | Impacto | Detalle |
|---|---|---|
| DB (Supabase) | **Alto** | Nueva tabla, triggers, función RPC, migración, backfill, RLS |
| Backend (RPC) | **Medio** | 2-3 nuevas funciones SQL, modificaciones a triggers de votos existentes |
| Frontend | **Medio** | Badge, score en reseñas, panel en dashboard, leaderboard |
| Infra | **Bajo** | Solo migración; sin cambios de infraestructura |
| Tests | **Medio** | RLS tests, cálculo tests, E2E tests |

## Prioridad

**P2 — Importante pero no urgente**

Justificación:
- No es P0/P1 porque no rompe funcionalidad existente ni es un security issue.
- Es P2 porque agrega valor real: los usuarios necesitan una señal de confianza al leer reseñas, y el score incentiva la creación de contenido de calidad.
- El ROADMAP actual no lo contempla; sería un epic nuevo en Fase 3 (Moderación y confianza).

## Preguntas abiertas

| # | Pregunta | Opciones | Requiere |
|---|---|---|---|
| Q1 | ¿Fórmula del score? | Propuesta: `+10 reseña, +5 like, -3 dislike`. Alternativas: proporcional, ponderado por antigüedad | Validación de negocio |
| Q2 | ¿Dónde se muestra el score? | Solo perfil / en cada reseña / leaderboard / en búsquedas | Preferencia de UX |
| Q3 | ¿Gamificación con niveles? | Sí (badges por tramos) / No (solo número) | Decisión de producto |
| Q4 | ¿Backfill histórico? | Sí (calcular desde day 1) / No (solo desde lanzamiento) | Preferencia de negocio |
| Q5 | ¿Score para inmobiliarias? | Ya tienen `rating`; ¿karma adicional? / No | Decisión de producto |
| Q6 | ¿Breakdown público o privado? | Público (transparencia) / Privado (solo el usuario ve su desglose) | Preferencia de privacidad |
| Q7 | ¿Piso de score? | 0 (nunca negativo) / Sin piso (puede ser negativo) | Decisión de diseño |

## Roadmap sugerido

Este feature encaja naturalmente en la **Fase 3 — Moderación y confianza** del ROADMAP, como EPIC-12:

```
EPIC-12: Reputación y puntaje de usuario
├── Sprint A: Backend (tabla, triggers, RPC, backfill)
├── Sprint B: Frontend (badges, score en reseñas, dashboard)
└── Sprint C: Leaderboard + tests E2E completos
```

## Referencias técnicas

- Migraciones: `supabase/migrations/`
- Tipos generados: `src/types/supabase/supabase.ts`
- Módulo profiles: `src/modules/profiles/`
- Funciones de votos: ver migraciones de vote functions
- Vistas materializadas: `*_vote_stats` en migraciones
