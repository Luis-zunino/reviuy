# Flujo 09 — Garantías de alquiler

## Propósito

Ofrecer a los usuarios un espacio donde explorar, comparar y reseñar los distintos proveedores de garantías de alquiler que existen en Uruguay (Anda, Porto, SURA, Achuran, Garantía Mía, depósito directo, etc.). El objetivo es que el inquilino pueda tomar una informada decisión sobre qué garantía contratar antes de firmar un contrato de alquiler.

## Contexto actual

**No existe nada de garantías en la plataforma.** La palabra "garantía" aparece solo como texto suelto dentro de los tips de alquiler (depósito de garantía, co-firmante, etc.), pero no hay:

- Tabla de proveedores de garantía
- Reseñas ni opiniones sobre garantías
- Página de exploración de garantías
- Comparativa de costos, coberturas o condiciones
- Votos ni favoritos sobre garantías

En Uruguay, las garantías de alquiler son un tema crítico para los inquilinos. Los proveedores más conocidos son:

| Proveedor | Tipo | Descripción |
|---|---|---|
| **Anda** | Seguro de caución | Paga al propietario si el inquilino no cumple. El inquilino paga una prima anual. |
| **Porto** | Seguro de caución | Similar a Anda, con prima anual sobre el monto del alquiler. |
| **SURA** | Seguro de caución | Seguradora grande con producto de caución alquiler. |
| **Achuran** | Garantía mutua | Sistema de garantía recíproca. |
| **Garantía Mía** | Plataforma digital | Fintech que ofrece garantías de alquiler. |
| **Depósito directo** | Directo con el propietario | El inquilino deposita 1-3 meses de alquiler como garantía. No requiere tercero. |
| **Boleta de depósito** | Bancocentral | Depósito bancario a favor del propietario. |

## Alcance del feature

### Lo que se construye

1. **Backend (DB)**
   - Tabla `guarantee_providers` — catálogo de proveedores (nombre, tipo, descripción, URL, logo)
   - Tabla `guarantee_reviews` — reseñas de usuarios sobre cada proveedor
   - Tabla `guarantee_review_votes` — likes/dislikes en reseñas de garantías
   - Tabla `guarantee_reports` — reportes de abuso
   - Vista pública `guarantee_providers_public` — catálogo visible para anónimos
   - Vista `guarantee_providers_with_votes` — proveedores con contadores de votos
   - RPCs: CRUD de reseñas, votos, favoritos, reportes (patrón replicado del módulo de inmobiliarias)
   - RLS siguiendo el patrón existente (SELECT público, escritura autenticada)

2. **Frontend**
   - Ruta `/garantias` — listado de proveedores con filtros (tipo, popularity)
   - Ruta `/garantias/:id` — detalle del proveedor con reseñas, votos, favoritos
   - Crear/editar/eliminar reseña de un proveedor de garantía
   - Botones de like/dislike y favorito (reutilizar componentes existentes)
   - Dialog de reporte (reutilizar `ReportDialog` existente)
   - Integración en el navbar: nuevo link "Garantías"

3. **Tests**
   - Tests RLS para las nuevas tablas
   - Tests E2E del flujo completo (explorar → detalle → reseñar → votar)

### Lo que NO se construye (por ahora)

- Comparador de costos en tiempo real (requiere scraping o API de proveedores)
- Cálculo automático de cuánto pagaría el usuario según su alquiler
- Integración directa con APIs de Anda/Porto/etc.
- Reseñas de other types de seguros (auto, salud, etc.)

## Modelo de datos propuesto

```sql
-- Catálogo de proveedores (cargado manualmente o vía seed)
CREATE TABLE guarantee_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500),
  provider_type VARCHAR(50) NOT NULL, -- 'insurance', 'mutual', 'direct', 'fintech'
  website_url TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reseñas de usuarios sobre proveedores
CREATE TABLE guarantee_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  provider_id UUID NOT NULL REFERENCES guarantee_providers(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description VARCHAR(800) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  contract_duration_months INTEGER, -- duración de su contrato con el proveedor
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(user_id, provider_id) -- 1 reseña por usuario por proveedor
);

-- Votos en reseñas de garantías
CREATE TABLE guarantee_review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guarantee_review_id UUID NOT NULL REFERENCES guarantee_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(guarantee_review_id, user_id)
);

-- Reportes de abuso
CREATE TABLE guarantee_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guarantee_review_id UUID NOT NULL REFERENCES guarantee_reviews(id),
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

- [ ] Tabla `guarantee_providers` con al menos 6 proveedores uruguayos en seed
- [ ] Tabla `guarantee_reviews` con RLS: SELECT público, INSERT/UPDATE/DELETE autenticado (propietario)
- [ ] Tabla `guarantee_review_votes` con RLS y constraint UNIQUE por usuario/resena
- [ ] Tabla `guarantee_reports` con RLS: SELECT propio, INSERT propio, service_role completo
- [ ] Vista pública `guarantee_providers_with_votes` con contadores de likes/dislikes
- [ ] RPCs: `create_guarantee_review`, `update_guarantee_review`, `delete_guarantee_review_safe`
- [ ] RPCs: `vote_guarantee_review`, `get_guarantee_review_vote_counts`
- [ ] RPCs: `toggle_favorite_guarantee_provider`, `is_guarantee_provider_favorite`
- [ ] RPCs: `report_guarantee_review`, `has_user_reported_guarantee_review`
- [ ] RPCs: `get_guarantee_providers_paginated`, `get_guarantee_provider_detail`
- [ ] Seed de datos con al menos 6 proveedores reales uruguayos

### Frontend

- [ ] Ruta `/garantias` con listado de proveedores (cards con nombre, tipo, rating promedio, cantidad de reseñas)
- [ ] Ruta `/garantias/:slug` con detalle del proveedor y sus reseñas
- [ ] Formulario de creación/edición de reseña (rating 1-5, título, descripción, duración del contrato)
- [ ] Botones de like/dislike en cada reseña (reutilizar `VoteButtons`)
- [ ] Botón de favorito en el detalle del proveedor (reutilizar `FavoriteRealEstateButton` como patrón)
- [ ] Dialog de reporte (reutilizar `ReportDialog`)
- [ ] Integración en navbar: link "Garantías" visible para todos
- [ ] Estados vacíos: "Sé el primero en reseñar este proveedor"
- [ ] Loading states y error handling

### Tests

- [ ] Tests RLS: anónimo puede leer proveedores y reseñas; autenticado puede CRUD su reseña; nadie puede modificar votos de otro
- [ ] Test E2E: explorar garantías → ver detalle → crear reseña → votar → verificar contadores
- [ ] Test E2E: reportar una reseña de garantía

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Pocos usuarios reseñen garantías (cold start) | Alta | Medio | Seed de reseñas ficticias标注 como "ejemplo" o empezar sin reseñas y promover el feature |
| Información desactualizada de proveedores | Media | Bajo | Permitir actualización del catálogo por el equipo; no depender de APIs externas |
| Proveedores legales no gusten de ser reseñados | Baja | Medio | Los proveedores son servicios legales; las reseñas son opiniones protegidas. Mantener tono informativo |
| Confusión entre "garantía" (proveedor) y "depósito de garantía" (dinero) | Media | Bajo | Naming claro: "Proveedores de garantía" no "Garantías". UI distinguishente |

## Dependencias

| Dependencia | Estado | Riesgo |
|---|---|---|
| Patrón de CRUD de reseñas (reviews) | ✅ Existe | — |
| Patrón de votos (votes) | ✅ Existe | — |
| Patrón de favoritos | ✅ Existe | — |
| Patrón de reportes | ✅ Existe | — |
| Componentes UI reutilizables | ✅ Existen | VoteButtons, FavoriteButton, ReportDialog |

**No hay dependencias bloqueantes.** El patrón del módulo `real-estates` se replica directamente.

## Prioridad

**P2 — Importante pero no urgente**

Justificación:
- Las garantías son un topic relevante para inquilinos uruguayos, pero la plataforma primero necesita consolidar su core (reseñas de alquileres e inmobiliarias).
- El feature es "nice to have" para la experiencia completa, pero no bloquea el uso principal de la plataforma.
- Se beneficia de tener EPIC-07 (panel de moderación) ya implementado para manejar reportes.

## Preguntas abiertas

| # | Pregunta | Opciones | Requiere |
|---|---|---|---|
| Q1 | ¿Seed de proveedores? | Manually curated por el equipo / los usuarios pueden proponer nuevos | Decisión de producto |
| Q2 | ¿Solo garantías de alquiler? | Sí (foco) / También depósitos, co-firmantes, etc. | Alcance del feature |
| Q3 | ¿Comparativa de costos? | Sí (tabla estática de参考) / No (solo reseñas) | Esfuerzo adicional |
| Q4 | ¿Moderación estricta? | Normal (como reseñas) / Estricta (por temas financieros) | Política de contenido |
| Q5 | ¿Las reseñas requieren verificación de contrato? | Sí (upload de comprobante) / No (confianza) | Complejidad vs confianza |

## Roadmap sugerido

Este feature se ubica en **Fase 4 — Crecimiento**, como EPIC-13:

```
EPIC-13: Garantías de alquiler
├── Sprint A: Backend (tablas, seed, RPCs, RLS)
├── Sprint B: Frontend (listado, detalle, reseñas, votos)
└── Sprint C: Favoritos, reportes, tests E2E
```

## Referencias técnicas

- Patrón a replicar: módulo `real-estates` (tablas, RLS, RPCs, componentes)
- Componentes reutilizables: `VoteButtons`, `FavoriteRealEstateButton`, `ReportDialog`
- Migraciones: `supabase/migrations/`
- Seed data: `supabase/seed-test-data.sql`
