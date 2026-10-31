# Flujo 10 — Tips recomendados por usuarios

## Propósito

Permitir a los usuarios autenticados proponer, votar y comentar nuevos tips de alquiler, creando un canal de contenido generado por la comunidad que complementa los tips editoriales escritos por el equipo de ReviUy.

## Contexto actual

Los tips actuales son **contenido 100% estático**: 11 artículos hardcodeados en `src/modules/content/data/tips.mock.ts` (~4,877 líneas). El usuario solo puede leerlos y filtrarlos por categoría. No existe mecanismo alguno para que un usuario:

- Proponga un nuevo tip
- Vote si un tip propuesto es útil
- Comente o sugiera mejoras a un tip existente
- Reporte un tip inapropiado

## Alcance del feature

### Lo que se construye

1. **Backend (DB)**
   - Tabla `user_tips` — tips propuestos por usuarios (título, contenido, categoría, estado)
   - Tabla `user_tip_votes` — votos de la comunidad para indicar utilidad
   - Tabla `user_tip_comments` — comentarios/sugerencias sobre un tip propuesto
   - Tabla `user_tip_reports` — reportes de contenido inapropiado
   - Estados del tip: `pending` (propuesto), `approved` (visible públicamente), `rejected` (rechazado), `featured` (destacado por el equipo)
   - Vista pública `user_tips_public` — tips aprobados visibles para anónimos
   - RPCs: CRUD de tips, votos, comentarios, reportes
   - RLS: tips aprobados son públicos; votos y comentarios son del propio usuario

2. **Frontend**
   - Ruta `/tips/comunidad` — listado de tips de la comunidad (sección separada de los tips editoriales)
   - Formulario de propuesta de tip (título, contenido enrich text o markdown, categoría)
   - Sistema de votación: "¿Este tip es útil?" con contador
   - Comentarios en tips propuestos
   - Panel en perfil: "Mis tips propuestos" con estados
   - Integración: sección "Tips de la comunidad" en la página de tips principal
   - Botón "Proponer un tip" visible para usuarios autenticados

3. **Moderación**
   - Los tips nuevos entran en estado `pending`
   - El equipo (o futuro panel de moderación) revisa y aprueba/rechaza
   - Reportes de tips siguen el mismo patrón que reseñas
   - Un tip aprobado puede ser destacado (`featured`) por el equipo

4. **Tests**
   - Tests RLS para las nuevas tablas
   - Tests E2E: proponer tip → votar → verificar visibilidad

### Lo que NO se construye (por ahora)

- Editor rich text avanzado (Markdown simple es suficiente para MVP)
- Sistema de versionado de tips (el equipo edita directamente si necesita)
- Notificación al autor cuando su tip es aprobado/rechazado (pendiente EPIC-09)
- Integración con los tips editoriales existentes (son flujos separados)

## Modelo de datos propuesto

```sql
-- Tips propuestos por usuarios
CREATE TABLE user_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'contracts', 'costs', 'rights', 'inspection', 'negotiation', 'other'
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'featured'
  rejection_reason VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Votos de utilidad
CREATE TABLE user_tip_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_tip_id UUID NOT NULL REFERENCES user_tips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_tip_id, user_id)
);

-- Comentarios/sugerencias
CREATE TABLE user_tip_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_tip_id UUID NOT NULL REFERENCES user_tips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Reportes
CREATE TABLE user_tip_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_tip_id UUID NOT NULL REFERENCES user_tips(id),
  reported_by_user_id UUID NOT NULL REFERENCES auth.users(id),
  reason VARCHAR(200) NOT NULL,
  description VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Criterios de aceptación

### Backend

- [ ] Tabla `user_tips` con los 4 estados (pending, approved, rejected, featured)
- [ ] Tabla `user_tip_votes` con RLS y constraint UNIQUE
- [ ] Tabla `user_tip_comments` con RLS (propietario puede editar/borrar su comentario)
- [ ] Tabla `user_tip_reports` con patrón de reportes existente
- [ ] Vista pública `user_tips_public` con contadores de votos (solo tips aprobados/featured)
- [ ] RPCs: `create_user_tip`, `update_user_tip`, `delete_user_tip_safe`
- [ ] RPCs: `vote_user_tip`, `get_user_tip_vote_counts`
- [ ] RPCs: `add_user_tip_comment`, `get_user_tip_comments`
- [ ] RPCs: `report_user_tip`, `has_user_reported_user_tip`
- [ ] RPCs: `get_user_tips_paginated(status, page, limit)`
- [ ] RPCs: `get_user_tips_by_current_user()` — tips propios del usuario
- [ ] Función de moderación: `moderate_user_tip(id, status, reason)` (service_role)

### Frontend

- [ ] Ruta `/tips/comunidad` con listado de tips aprobados y destacados
- [ ] Formulario de propuesta: título, contenido (textarea con preview), categoría (select)
- [ ] Botón "¿Este tip es útil?" con like/dislike y contador
- [ ] Sección de comentarios debajo de cada tip
- [ ] Panel en perfil: pestaña "Mis tips" con estados (pendiente, aprobado, rechazado)
- [ ] Integración en `/tips`: sección "Tips de la comunidad" debajo de los tips editoriales
- [ ] Botón "Proponer un tip" visible para autenticados en la página de tips
- [ ] Estados vacíos: "Sé el primero en proponer un tip"
- [ ] Loading states y error handling

### Tests

- [ ] Tests RLS: anónimo solo ve tips aprobados; autenticado puede CRUD sus tips; propietario puede borrar su tip
- [ ] Test E2E: proponer tip → verificar estado pending → (simular aprobación) → aparece en listado público
- [ ] Test E2E: votar un tip → verificar contadores
- [ ] Test E2E: comentar en un tip → verificar que aparece

## Flujo de moderación

```
Usuario propone tip
        │
        ▼
   Estado: pending
        │
   ┌────┴────┐
   ▼         ▼
approved   rejected
   │         │
   ▼         ▼
Visible    No visible
públicam.  + razón
   │
   ▼
featured (opcional,
destacado por equipo)
```

- **pending**: Solo visible para el autor y el equipo
- **approved**: Visible públicamente en `/tips/comunidad`
- **rejected**: No visible; el autor ve la razón del rechazo
- **featured**: Misma funcionalidad que approved pero con badge visual de "destacado"

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Cold start: pocos tips propuestos | Alta | Medio | Seed de tips de ejemplo标注 como "comunidad"; promover el feature en la UI |
| Contenido de baja calidad | Media | Medio | Moderación obligatoria antes de publicar; razones de rechazo predefinidas |
| Confusión entre tips editoriales y de comunidad | Media | Bajo | Secciones visuales diferenciadas; labels "Editorial" vs "Comunidad" |
| Spam de tips | Media | Bajo | Rate limiting existente; máximo N tips por usuario; moderación |
| Tips desactualizados | Media | Bajo | Los tips pueden ser editados/borrados; el equipo puede feature/rechazar |

## Dependencias

| Dependencia | Estado | Riesgo |
|---|---|---|
| Patrón de CRUD de reseñas | ✅ Existe | — |
| Patrón de votos | ✅ Existe | — |
| Patrón de reportes | ✅ Existe | — |
| Sistema de moderación (EPIC-07) | 🟡 Pendiente | El flujo de moderación manual existe vía email+RPC; el panel facilitaría la revisión |
| Rate limiting | ✅ Existe | — |

**Dependencia menor con EPIC-07** (panel de moderación): sin el panel, la revisión de tips pendientes se hace por el mismo flujo manual actual (email + RPC). No bloquea la implementación.

## Prioridad

**P2 — Importante pero no urgente**

Justificación:
- Los tips editoriales existentes ya cubren las necesidades básicas. Los tips de comunidad son un complemento, no un reemplazo.
- La moderación de contenido generado por usuarios requiere proceso, no solo tecnología.
- Se beneficia de tener EPIC-07 (panel de moderación) para escalar la revisión de tips propuestos.

## Preguntas abiertas

| # | Pregunta | Opciones | Requiere |
|---|---|---|---|
| Q1 | ¿Los tips de comunidad aparecen en la misma página `/tips`? | Sí (sección separada abajo) / Página independiente `/tips/comunidad` | Decisión de UX |
| Q2 | ¿Máximo de tips por usuario? | Sin límite / 3 / 5 / 10 | Política de contenido |
| Q3 | ¿Comentarios anónimos? | No (solo autenticados) / Sí (pero sin user_id visible) | Moderación |
| Q4 | ¿El equipo puede editar tips de usuarios? | Sí (para correcciones menores) / No (solo aprobar/rechazar) | Política editorial |
| Q5 | ¿Categorías iguales a las de los tips editoriales? | Sí (reutilizar) / Nuevas categorías específicas | Diseño de IA |
| Q6 | ¿Notificación al autor al aprobar/rechazar? | Sí (email) / No (solo estado en perfil) | Depende de EPIC-09 |

## Roadmap sugerido

Este feature se ubica en **Fase 4 — Crecimiento**, como EPIC-14:

```
EPIC-14: Tips recomendados por usuarios
├── Sprint A: Backend (tablas, RPCs, RLS, funcionalidad de moderación)
├── Sprint B: Frontend (formulario, listado, votos, comentarios)
└── Sprint C: Integración en página de tips, panel en perfil, tests E2E
```

## Referencias técnicas

- Tips editoriales (actuales): `src/modules/content/data/tips.mock.ts`
- Página de tips: `src/components/features/Tips/`
- Patrón a replicar: módulo `property-reviews` (CRUD, votos, reportes)
- Componentes reutilizables: `VoteButtons`, `ReportDialog`
- Moderación actual: `src/modules/moderation/`
