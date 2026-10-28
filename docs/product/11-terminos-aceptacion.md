# Flujo 11 — Aceptación y re-aceptación de términos y condiciones

## Propósito

Garantizar que en todo momento el usuario que usa ReviUy tenga un **consentimiento vigente** sobre los términos y condiciones vigentes. Esto implica: exigir aceptación en el primer registro y **re-exigir aceptación automáticamente cuando se actualiza la versión de los términos**, incluso para usuarios con sesión activa.

## Contexto legal

En Uruguay, los términos y condiciones (T&C) constituyen un contrato de adhesión (Ley 17.250 — Relaciones de Consumo). Para que el consentimiento sea válido:

- El usuario debe **conocer** los T&C antes de aceptarlos.
- El **consentimiento debe corresponder a la versión vigente** al momento del uso.
- Si los T&C cambian, el usuario debe **consentir el cambio** (no puede asumirse consentimiento tácito sobre versiones nuevas).
- Debe quedar **evidencia registrable** de qué versión aceptó cada usuario y cuándo.

**El riesgo actual**: si la plataforma cambia los T&C y el usuario ya está con sesión activa, puede seguir usándola sin consentir la nueva versión. Esto debilita la posición legal de ReviUy ante una disputa.

## Cómo funciona HOY

El sistema ya tiene un **mecanismo básico de versionado**, pero con gaps:

### Lo que funciona

1. `CURRENT_TERMS_VERSION = 'v2'` se define en `src/constants/legal-terms.constant.ts` (línea 2).
2. En el callback de auth (`src/app/auth/callback/page.tsx:40-51`) se compara `user_metadata.terms_version` contra `CURRENT_TERMS_VERSION`.
3. Si no coinciden → redirige a `/auth/accept-terms`.
4. Al aceptar (`src/components/features/AcceptTerms/AcceptTerms.tsx:73-96`) se guarda `terms_accepted_at` + `terms_version` en `user_metadata`.
5. El botón de aceptar está bloqueado hasta que el usuario **scrollea al final** del texto (IntersectionObserver).

### Los gaps detectados

| # | Gap | Código afectado | Impacto legal |
|---|---|---|---|
| G1 | **Solo se verifica en el login**. Un usuario con sesión activa no se ve afectado hasta cerrar sesión y volver a entrar. | `callback/page.tsx` | Puede usar la plataforma con T&C desactualizados |
| G2 | **No hay bloqueo "en vivo"** vía middleware para sesiones activas con versión vieja. | `middleware.ts` | Idem G1 |
| G3 | **Inconsistencia**: `AcceptTerms.tsx:37` redirige a home si existe `terms_accepted_at`, sin comparar la versión. El callback sí compara versión. Doble lógica. | `AcceptTerms.tsx` | Puede saltarse la re-aceptación |
| G4 | **No se registra auditoria** de la aceptación/re-aceptación (quién, qué versión, cuándo). Solo queda en `user_metadata` sin historial. | — | Débil evidencia de consentimiento |
| G5 | Bonus: `user_metadata` se sobreescribe en cada re-aceptación, no guarda historial de versiones anteriores. | `AcceptTerms.tsx` | No hay trail auditable |

## Alcance del feature

### Lo que se construye

1. **Re-aceptación en sesión activa (el fix principal)**
   - Lectura del `terms_version` del usuario en el middleware para rutas protegidas.
   - Si es menor a `CURRENT_TERMS_VERSION` → redirigir a `/auth/accept-terms` con retorno (`?next=`).
   - Todos los H/ entrar por rutas protegidas pasan el checkeo.

2. **Unificar la lógica de checkeo**
   - Crear un único helper `hasAcceptedLatestTerms(user)` que compare versión y fecha.
   - Usarlo tanto en el callback como en el middleware y en `AcceptTerms`.
   - Eliminar la doble lógica.

3. **Auditoria de aceptaciones**
   - Nueva tabla `terms_acceptance` (ver modelo abajo) para historial.
   - Se registra un row por cada aceptación: user_id, version, accepted_at.
   - Complementa a `security_logs` (que registra eventos de seguridad, no consentimiento).

4. **Ampliación del contenido de T&C (recomendado)**
   - Los T&C actuales tienen 6 secciones breves. Ampliar para cubrir features futuros:
     - Contenido generado por usuarios (UGC) y responsabilidad sobre reseñas de terceros.
     - Sección de garantías de alquiler (si EPIC-13 avanza).
     - Tips propuestos por usuarios y su moderación (si EPIC-14 avanza).
     - Reglas de propiedad intelectual sobre tips/garantías propuestas.
   - Esto debe hacerse **antes** de lanzar features que generen nuevo UGC.

5. **Tests**
   - Tests E2E: accept inicial, re-accept tras bump de versión, sesión activa bloqueada.
   - Tests de middleware: rutas protegidas redirigen si versión vieja.
   - Tests de la función `hasAcceptedLatestTerms`.

### Lo que NO se construye (por ahora)

- Consentimiento dividido por categoría (marketing, legal, etc.) — overkill para MVP.
- Centro de preferencias de consentimiento con historial visible al usuario.
- Firma electrónica avanzada para aceptación.

## Modelo de datos propuesto

```sql
-- Historial de aceptaciones de términos (evidencia legal)
CREATE TABLE terms_acceptance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  terms_version VARCHAR(20) NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  UNIQUE(user_id, terms_version)
);

-- RLS: solo el propio usuario y service_role leen
ALTER TABLE terms_acceptance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "terms_acceptance_select_own"
  ON terms_acceptance FOR SELECT
  USING (auth.uid() = user_id);

-- Solo system escribe (via RPC/trigger SECURITY DEFINER)
CREATE POLICY "terms_acceptance_insert_system"
  ON terms_acceptance FOR INSERT
  WITH CHECK (false);
```

## Criterios de aceptación

### Backend / Seguridad

- [ ] Tabla `terms_acceptance` existe con RLS correcto
- [ ] Al aceptar términos se registra un row en `terms_acceptance` (user_id, version, accepted_at, ip, user_agent)
- [ ] Los T&C actuales guardan `terms_version` en `user_metadata` (mecanismo existente sigue funcionando)
- [ ] La tabla complementa (no reemplaza) el mecanismo `user_metadata` existente

### Protección de flujo

- [ ] Al subir `CURRENT_TERMS_VERSION`, un usuario con sesión activa y versión vieja **es redirigido a `/auth/accept-terms`** al intentar acceder a cualquier ruta protegida
- [ ] La re-aceptación mantiene la sesión (solo actualiza metadata y registra auditoria)
- [ ] El checkeo unificado `hasAcceptedLatestTerms(user)` se usa en callback, middleware y `AcceptTerms`
- [ ] Un usuario que ya aceptó la versión actual NO es redirigido (no loop)

### Audibilidad

- [ ] Se guarda IP y user_agent en cada aceptación
- [ ] El historial permite reconstruir qué versión aceptó cada usuario y cuándo
- [ ] Tests verifican que se escribe el row de auditoria

### Tests

- [ ] E2E: primer registro → accept → home
- [ ] E2E: bump de versión → usuario con sesión activa → redirigido a accept-terms → re-acepta → acceso normal
- [ ] E2E: usuario que ya aceptó la versión actual → no redirigido (sin loop)
- [ ] Unit: `hasAcceptedLatestTerms` cubre casos (sin versión, versión igual, versión vieja, sin fecha)

### Contenido legal

- [ ] T&C ampliados si aplica (UGC, garantías, tips de comunidad) — decidir antes de lanzar features que generen nuevo UGC

## Dependencias

| Dependencia | Estado |
|---|---|
| Mecanismo de versionado (`CURRENT_TERMS_VERSION`) | ✅ Existe |
| Página `/auth/accept-terms` | ✅ Existe |
| Callback de auth con checkeo de versión | ✅ Existe |
| Middleware para rutas protegidas | ✅ Existe |
| Tabla `security_logs` | ✅ Existe (complementaria) |
| Revisión legal de contenido (abogado) | 🔶 Externo — recomendar antes de ampliar T&C |

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Break del flujo de login si el middleware es demasiado agresivo | Media | Alto | Excluir `/auth/*` de la regla; tests E2E exhaustivos |
| Users abandonan al exigirles re-aceptar (fricción) | Media | Bajo | Solo exigir cuando la versión cambia de verdad; mensaje claro de qué cambió |
| Redacción de T&C mal hecha agrava el riesgo legal | Baja | Alto | Revisión por asesor legal antes de ampliar contenido |
| Loop de redirección infinite | Baja | Alto | Chequeo explícito de que ya aceptó versión actual antes de redirigir |

## Impacto por capa técnica

| Capa | Impacto | Detalle |
|---|---|---|
| DB (Supabase) | **Medio** | Nueva tabla `terms_acceptance`, RLS |
| Backend (RPC) | **Bajo** | Función para registrar aceptación |
| Middleware | **Alto** | Regla de re-aceptación en rutas protegidas |
| Frontend | **Medio** | Unificar `hasAcceptedLatestTerms`, ajustar `AcceptTerms` |
| Tests | **Alto** | E2E de re-aceptación, unit de helper |

## Prioridad

**P1 — Alta (legal + funcional)**

Justificación:
- Es un **riesgo legal** para la plataforma. Si una disputa surge, la posición de ReviUy se debilita sin consentimiento vigente.
- El mecanismo base ya existe (versionado), el trabajo es endurecerlo (sesión activa + auditoria), por lo que el esfuerzo es **bajo a medio**.
- Debe hacerse **antes** de lanzar features que generen nuevo contenido de usuario (garantías, tips), que requieren T&C ampliados.

## Preguntas abiertas

| # | Pregunta | Opciones | Requiere |
|---|---|---|---|
| Q1 | ¿Ampliar T&C ahora o solo endurecer el mecanismo? | Solo mecanismo (rápido) / también ampliar contenido legal | Revisión abogado |
| Q2 | ¿Redirigir solo rutas protegidas o todo el sitio? | Solo acciones que requieren sesión / todo uso | Decisión de producto |
| Q3 | ¿Mensaje de "qué cambió" para el usuario? | Sí (diff de cambios) / No (solo volver a leer) | UX + legal |
| Q4 | ¿Exigir re-aceptación inmediata o con grace period? | Inmediata (bloqueo) / 7 días / 30 días | Urbanidad de producto |
| Q5 | ¿Guardar IP/user_agent? | Sí (más evidencia) / No (más privacidad) | Trade-off legal vs privacidad |

## Roadmap sugerido

Se ubica como **EPIC-16** en Fase 1 (Consolidación P0/P1) — debe avanzar temprano por su componente legal:

```
EPIC-16: Aceptación y re-aceptación de términos
├── Sprint A: Backend (tabla terms_acceptance, RPC, auditoria)
├── Sprint B: Middleware (re-aceptación en sesión activa)
├── Sprint C: Unificar helper + tests E2E
└── (Opcional) Sprint D: Ampliar contenido T&C con asesor legal
```

## Referencias técnicas

- `src/constants/legal-terms.constant.ts` — versión y texto de T&C
- `src/app/auth/callback/page.tsx` — checkeo de versión en login
- `src/app/auth/accept-terms/page.tsx` — página de aceptación
- `src/components/features/AcceptTerms/AcceptTerms.tsx` — componente de aceptación
- `src/enums/pagesUrls.enum.ts` — `ACCEPT_TERMS` route
- `middleware.ts` — rutas protegidas (donde agregar la regla)
