# ReviUy — Roadmap de Producto

> Documento maestro de planificación. Última actualización: octubre 2026.

## 1. Estado Actual del Producto

### Lo que funciona hoy (MVP consolidado)

| Flujos | Estado |
|---|---|
| Auth (magic link + Google) | ✅ Producción |
| Explorar reseñas por zona/cercanía | ✅ Producción |
| Detalle de dirección con reseñas | ✅ Producción |
| Detalle de inmobiliaria con reseñas | ✅ Producción |
| Crear / editar / eliminar reseña | ✅ Producción |
| Crear / editar inmobiliaria | ✅ Producción |
| Votos (like/dislike) en reseñas e inmobiliarias | ✅ Producción |
| Favoritos (reseñas + inmobiliarias) | ✅ Producción |
| Reportes (reseñas + inmobiliarias) | ✅ Producción |
| Perfil de usuario (mis reseñas, favoritos, borrar cuenta) | ✅ Producción |
| Contacto por email | ✅ Producción |
| Contenido estático (tips, FAQ, legal, buenas prácticas) | ✅ Producción |
| Rate limiting (Upstash Redis) | ✅ Producción |
| CSP + headers de seguridad | ✅ Producción |
| CI/CD (type-check, lint, test, build, E2E, security) | ✅ Producción |
| Monitoreo Sentry (client, server, edge) | ✅ Producción |
| Load testing con k6 | ✅ Producción |

### Lo que está documentado pero limitado

| Limitación | Impacto usuario | Esfuerzo estimado |
|---|---|---|
| Home usa datos de demostración (reseñas destacadas, stats, barrios) | Baja — credibilidad visual | Medio |
| No hay paginación en reseñas de una dirección | Media — rendimiento con direcciones populares | Bajo |
| Subida de imágenes existe en backend pero no en UI | Media — riqueza de reseñas | Medio |
| No hay panel de moderación en la app | Media — workflow manual | Alto |
| No hay actividad/historial en perfil | Baja | Bajo |

### Deuda técnica conocida

| Ítem | Prioridad real |
|---|---|
| Módulo `content` incompleto (solo contacto; FAQ/tips/institucional dispersos) | Media |
| Tabla `rate_limits` en DB es redundante con Upstash Redis | Baja |
| Código legacy fuera de módulos que debería migrarse | Media |
| ~~Vistas materializadas sin refresh automático documentado~~ — Resuelto: las MVs se eliminaron; los contadores de votos se calculan en vivo en las vistas `_public` | — |
| Callback `/auth/callback` sigue siendo client-side (el inicio de login ya es server-side con rate limit, ver EPIC-15) | Media |

---

## 2. Backlog Priorizado

Cada epic tiene un ID, prioridad (P0-P3), estimación de esfuerzo y criterio de done.

### Fase 1 — Consolidación (P0/P1 — hacer ahora)

Estos ítems cierran brechas visibles y reducen deuda técnica.

#### EPIC-01: Home con datos reales

- **Prioridad**: P0
- **Esfuerzo**: Medio (2-3 sprints)
- **Beneficio**: La home pasa de demostración a producto real. Credibilidad.
- **Alcance**:
  - Reemplazar reseñas destacadas hardcoded por query real al top de reseñas por votos
  - Reemplazar estadísticas fijas por contadores reales (total reseñas, total inmobiliarias)
  - Barrios más comentados: query de zonas con más actividad
  - Tips destacados: mantener estáticos (ya son datos del módulo `content`)
- **Criterios de aceptación**:
  - [ ] La home muestra reseñas reales ordenadas por votos
  - [ ] Los contadores reflejan datos actuales de la DB
  - [ ] Las zonas más comentadas se calculan desde datos reales
  - [ ] Fallback a datos estáticos si la DB está vacía (cold start)
  - [ ] Performance: home carga < 2s en producción
- **Dependencias**: Ninguna

#### EPIC-02: Paginación de reseñas

- **Prioridad**: P1
- **Esfuerzo**: Bajo (1 sprint)
- **Beneficio**: Direcciones populares no degradan la experiencia.
- **Alcance**:
  - Paginación por offset/cursor en listados de reseñas (dirección e inmobiliaria)
  - Infinite scroll o paginación clásica (decidir)
  - Lazy loading de reseñas en detalle de dirección
- **Criterios de aceptación**:
  - [ ] Las reseñas se cargan por páginas (no todas de golpe)
  - [ ] El usuario puede navegarse entre páginas o hacer scroll infinito
  - [ ] No hay regresión en búsquedas existentes
- **Dependencias**: Ninguna

#### EPIC-16: Aceptación y re-aceptación de términos

- **Prioridad**: P1
- **Esfuerzo**: Bajo a medio (1-2 sprints)
- **Beneficio**: Consolida el consentimiento legal de los T&C; protege la posición de ReviUy ante disputas. El mecanismo de versionado ya existe; el trabajo es endurecerlo para sesiones activas y auditar.
- **Alcance**:
  - Tabla `terms_acceptance` para historial de aceptaciones (user_id, version, accepted_at, ip, user_agent)
  - Re-aceptación automática cuando `CURRENT_TERMS_VERSION` cambia, incluso para usuarios con sesión activa
  - Regla en middleware para rutas protegidas con versión vieja → redirigir a `/auth/accept-terms`
  - Unificar `hasAcceptedLatestTerms(user)` en callback, middleware y `AcceptTerms`
  - Auditoria de cada aceptación (evidencia legal)
  - (Opcional) Ampliar contenido de T&C con asesor legal antes de lanzar nuevo UGC
  - Tests E2E de re-aceptación y unit del helper
- **Criterios de aceptación**:
  - [ ] Usuario con sesión activa y versión vieja es redirigido a accept-terms al entrar a rutas protegidas
  - [ ] La tabla `terms_acceptance` registra cada aceptación con ip/user_agent
  - [ ] Lógica de checkeo unificada (sin doble implementación)
  - [ ] No hay loops de redirección
  - [ ] Tests E2E cubren accept inicial, re-accept y sesión activa bloqueada
- **Dependencias**: Ninguna. Los T&C ya se versionan; solo falta endurecer el flujo.
- **Documento**: [11-terminos-aceptacion.md](11-terminos-aceptacion.md)

---

#### EPIC-03: Consolidación módulo `content`

- **Prioridad**: P1
- **Esfuerzo**: Bajo (1 sprint)
- **Beneficio**: Ownership claro del contenido editorial. Prepara el terreno para CMS futuro.
- **Alcance**:
  - Mover dataset de tips a `src/modules/content/data/` (verificar que ya esté ahí)
  - Mover ítems de FAQ al módulo content
  - Mover textos de buenas prácticas al módulo content
  - Mover contenido institucional (about, legal) como data del módulo
  - Asegurar que los componentes UI consumen desde el módulo, no desde barrels
- **Criterios de aceptación**:
  - [ ] Todo contenido estático livea dentro de `src/modules/content/data/`
  - [ ] No hay imports de contenido desde ubicaciones fuera del módulo
  - [ ] Tests unitarios para queries de contenido del módulo
- **Dependencias**: Ninguna

#### EPIC-15: Login server-side

- **Prioridad**: P0
- **Esfuerzo**: Medio (2-3 sprints)
- **Estado**: Mayormente implementado (oct 2026). El login con magic link y Google se inicia desde server actions (`src/shared/auth/auth-server-actions.ts`) con rate limit de Upstash (por email y por IP) y validación server-side del email; el middleware usa `createServerClient`. Pendiente: callback server-side y validar los E2E de login.
- **Beneficio**: Seguridad: rate-limiting real en login, eliminación de cooldown client-side bypassable, validación server-side antes de enviar OTP/OAuth.
- **Alcance**:
  - Server Action o API route que reciba email y ejecute `signInWithOtp` desde el servidor usando service_role key
  - Server Action o API route que inicie `signInWithOAuth` desde el servidor
  - Rate-limiting real con Upstash Redis en el endpoint de login (máx N intentos por email/IP por minuto)
  - Eliminar cooldown client-side (`login-cooldown.util.ts`) — se reemplaza por el rate-limit server-side
  - Mover validación de email y lógica de negocio al server
  - Actualizar `AuthProvider.tsx` para llamar a los nuevos server actions en vez de supabase client-side
  - Evaluar migrar el middleware de session handling manual (`middleware.ts`) a `createServerClient` de Supabase SSR
  - Actualizar callback `/auth/callback` para usar server-side session handling
- **Criterios de aceptación**:
  - [x] El login (magic link) se inicia desde un server action, no desde el cliente
  - [x] El login (Google OAuth) se inicia desde un server action, no desde el cliente
  - [x] Rate-limiting real protege los endpoints de auth (Upstash Redis)
  - [x] El cooldown client-side se elimina o se convierte en UI-only (sin seguridad)
  - [x] El middleware usa `createServerClient` en lugar de parsing manual de cookies
  - [x] No hay llamadas a `supabase.auth.signIn*` desde código client-side
  - [ ] El callback `/auth/callback` maneja la sesión server-side
  - [ ] Tests E2E de login pasan después de la migración
  - [ ] No hay regresión en el flujo de autenticación
- **Dependencias**: Ninguna

#### EPIC-17: Hardening de seguridad (pendientes de auditoría)

- **Prioridad**: P1
- **Esfuerzo**: Medio (1-2 sprints)
- **Beneficio**: Cierra los hallazgos de seguridad que quedaron abiertos tras la auditoría de la migración y de la app (oct 2026). Ya se corrigieron: borrado de imágenes ajenas en R2, rate limit evadible por errores, rate limit global de Google, fail-open de Redis en auth, privilegios residuales en tablas y retención de logs.
- **Alcance**:
  - Imágenes: `limitInputPixels` y allowlist de formatos en `sharp`; verificar `is_mine` antes de procesar el archivo (evita DoS de memoria/CPU)
  - Imágenes: cola de borrado de R2 (`storage_deletions` + trigger `AFTER DELETE` en `review_images` + job), para no dejar objetos huérfanos ni fotos públicas tras borrar una reseña o una cuenta
  - Imágenes: derivar la URL de `R2_PUBLIC_URL + path` y restringir el host en el CHECK `review_images_url_matches_path`
  - Errores: no devolver mensajes de Postgres al cliente (`lib/errors/helpers.ts`, `with-error-handler.util.ts`); mensaje genérico + log en servidor
  - Validación: `update-property-review` debe usar el resultado del parse; schemas con límites, enums, `uuid` y `.strict()`
  - CSP: nonce + `strict-dynamic` (quitar `'unsafe-inline'`), `form-action 'self'` y host de R2 en `img-src`
  - Base: eliminar policies inertes que serían peligrosas si se re-otorga DML (`rate_limits_*_own`, `security_logs_insert_authenticated`, `reviews_delete_own`, insert/delete de votos y favoritos)
  - Menores: `import 'server-only'` en código con service_role; no usar `Cache-Control: public` en HTML autenticado; rate limit en borrado de imágenes; aceptar términos server-side; Sentry sin `sendDefaultPii`; verificar `Origin` en rutas API; `bodySizeLimit` de server actions acorde a 15 MB; completar `.env.example` (R2, service_role)
  - Verificar en Supabase cloud: `pg_cron` habilitado y jobs agendados; deshabilitar `pg_graphql` si no se usa
  - Correr semgrep (`pnpm security:semgrep`) en CI; hoy no está instalado
- **Criterios de aceptación**:
  - [ ] Una imagen enorme (bomba de píxeles) se rechaza sin agotar memoria
  - [ ] Borrar una reseña o una cuenta elimina sus objetos de R2 (o quedan encolados)
  - [ ] Ninguna respuesta de API expone mensajes internos de Postgres
  - [ ] La CSP no usa `'unsafe-inline'` en `script-src`
  - [ ] No quedan policies sin grant que la respalden
  - [ ] semgrep corre en CI sin hallazgos bloqueantes
- **Dependencias**: Ninguna

---

### Fase 2 — Experiencia (P1 — hacer después de Fase 1)

#### EPIC-04: Imágenes en reseñas

- **Prioridad**: P1
- **Esfuerzo**: Medio (2-3 sprints)
- **Beneficio**: Reseñas más ricas, mayor confianza del lector.
- **Alcance**:
  - UI de upload en wizard de creación/edición de reseña
  - Almacenamiento en Supabase Storage (ya configurado en `next.config.ts`)
  - Galería de imágenes en detalle de reseña
  - Validación: máximo N imágenes, tamaño máximo, formatos permitidos
  - Optimización de imágenes con `sharp` (ya en dependencias)
- **Criterios de aceptación**:
  - [ ] El usuario puede subir hasta 5 imágenes por reseña
  - [ ] Las imágenes se muestran en el detalle de la reseña
  - [ ] Formatos soportados: jpg, png, webp
  - [ ] Tamaño máximo: 5MB por imagen
  - [ ] Las imágenes se optimizan automáticamente
- **Dependencias**: Tabla `review_images` ya existe (migración 010)

#### EPIC-05: Paginación de inmobiliarias

- **Prioridad**: P1
- **Esfuerzo**: Bajo (1 sprint)
- **Beneficio**: El listado de inmobiliarias escala con datos reales.
- **Alcance**:
  - Paginación en `/explorar` para inmobiliarias
  - Búsqueda con debounce (ya existe `useDebounce`)
- **Criterios de aceptación**:
  - [ ] El listado paginado funciona correctamente
  - [ ] La búsqueda filtra en tiempo real con debounce
- **Dependencias**: EPIC-02 (patrón de paginación reutilizable)

#### EPIC-06: Actividad en perfil

- **Prioridad**: P2
- **Esfuerzo**: Bajo (1 sprint)
- **Beneficio**: El usuario ve su historial, mayor engagement.
- **Alcance**:
  - Timeline de acciones: reseñas creadas, votos, reportes enviados
  - Opción de consolidar en una query agregada
- **Criterios de aceptación**:
  - [ ] El perfil muestra actividad reciente del usuario
  - [ ] La actividad se carga de forma eficiente (una query)
- **Dependencias**: Módulo `profiles` ya funcional

#### EPIC-18: Rendimiento e integridad de datos (pendientes de auditoría)

- **Prioridad**: P2
- **Esfuerzo**: Bajo a medio (1-2 sprints)
- **Beneficio**: Menos errores confusos para el usuario, menos llamadas fallidas y consultas que escalan. Ya se resolvieron: búsquedas de explorar por RPC (de ~100 ms a <10 ms con 50k reseñas), unicidad de dirección con `address_osm_id` normalizado y límites de reportes alineados con la DB.
- **Alcance**:
  - Visitantes anónimos: habilitar los hooks `is_*_favorite`, `get_user_*_vote` y `has_user_reported_*` solo con sesión (hoy generan 401 con 3 reintentos por tarjeta)
  - `check_user_review_for_address`: pasar `p_property_type` y `p_apartment_number` desde el formulario (la advertencia de la UI no coincide con la regla de la DB)
  - Reseñas de inmobiliaria: límites en zod (`title` 200, `description` 400) y validación en las RPC; `create_real_estate` con `btrim` y largo máximo
  - Doble clic: `toggle_favorite_real_estate` y `create_real_estate_review` concurrentes devuelven un mensaje claro en vez de error crudo
  - `delete_review_safe`: devolver `{success, error}` como el resto de RPCs y aplicar rate limit
  - Búsqueda de inmobiliarias (`ilike` en nombre, filtro por rating): mismo patrón RPC que las búsquedas de reseñas
  - Búsqueda por zona sin tildes del lado del servidor (`unaccent`), para eliminar el fallback que filtra en el cliente
  - Índice en `reviews.user_id` (el borrado de cuentas recorre la tabla)
  - `log_security_event`: registrar la IP real del cliente o quitar las columnas que hoy guardan la IP del pooler
  - Limpieza: objetos sin uso (`get_*_paginated`, `get_*_vote_counts`, `rate_limit_stats`), índices redundantes y mover `citext` al schema `extensions`
  - Sitemap: hoy se trunca en 1000 filas por `max_rows` de PostgREST
  - Actualizar [04-crear-resena.md](04-crear-resena.md): el rate limit es 5 reseñas cada 10 minutos y la unicidad es por dirección + apartamento
- **Criterios de aceptación**:
  - [ ] Un visitante anónimo no genera peticiones 401 al navegar reseñas
  - [ ] Ningún flujo de reseñas o inmobiliarias devuelve "Error interno del servidor" por largo o formato inválido
  - [ ] La búsqueda de inmobiliarias responde < 50 ms con 10k inmobiliarias
  - [ ] El sitemap incluye todas las URLs indexables
  - [ ] La documentación de producto coincide con las reglas de la DB
- **Dependencias**: Ninguna

---

### Fase 3 — Moderación y confianza (P1/P2)

#### EPIC-07: Panel de moderación básico

- **Prioridad**: P1
- **Esfuerzo**: Alto (3-4 sprints)
- **Beneficio**: La moderación sale del workflow manual (email + RPC) a un panel dentro de la app.
- **Alcance**:
  - Ruta protegida `/moderation` (solo equipo ReviUy)
  - Lista de reportes pendientes con filtros (estado, tipo, fecha)
  - Detalle del reporte con contexto (reseña/inmobiliaria reportada)
  - Acciones: marcar como revisado, resolver, descartar
  - Notificación al reporter cuando se resuelve su reporte (email)
  - RBAC: solo usuarios con rol `moderator` acceden
- **Criterios de aceptación**:
  - [ ] Solo usuarios con rol moderator pueden acceder
  - [ ] Se listan todos los reportes pendientes
  - [ ] El moderador puede cambiar el estado de un reporte
  - [ ] Se envía email de notificación al resolver
  - [ ] RLS protege la tabla de reportes correctamente
- **Dependencias**: Módulo `moderation` existente, tabla `role` o claim en auth.users

#### EPIC-08: Ocultamiento automático de contenido reportado

- **Prioridad**: P2
- **Esfuerzo**: Medio (1-2 sprints)
- **Beneficio**: Contenido tóxico no permanece visible mientras se revisa.
- **Alcance**:
  - Si una reseña tiene ≥ N reportes distintos, se oculta automáticamente
  - El autor recibe notificación
  - El moderador puede reactivar
- **Criterios de aceptación**:
  - [ ] La reseña se oculta al alcanzar el umbral de reportes
  - [ ] El autor es notificado
  - [ ] El moderador puede reactivar
- **Dependencias**: EPIC-07

#### EPIC-12: Reputación y puntaje de usuario

- **Prioridad**: P2
- **Esfuerzo**: Medio (2-3 sprints)
- **Beneficio**: Señal de confianza para lectores; incentivo de calidad para autores. Gamificación ligera que engagement.
- **Alcance**:
  - Tabla `user_reputation` con score, contadores y desglose
  - Función `calculate_user_reputation(user_id)` y triggers de actualización
  - RPC `get_user_reputation(user_id)` y vista `user_reputation_leaderboard`
  - Badge de reputación en perfil y score visible en reseñas
  - Panel de desglose en dashboard del usuario
  - Página `/leaderboard` con top contributors
  - Script de backfill para usuarios existentes
  - Tests RLS, tests de cálculo, tests E2E
- **Criterios de aceptación**:
  - [ ] Tabla `user_reputation` con RLS correctamente configurado
  - [ ] Score se actualiza automáticamente al crear/borrar reseñas y votos
  - [ ] Badge visible en perfil y score en cada reseña
  - [ ] Leaderboard muestra usuarios ordenados por score
  - [ ] Backfill calcula score histórico sin degradar performance
  - [ ] Tests RLS pasan para la nueva tabla
- **Dependencias**: Ninguna (toda la infraestructura de votos ya existe)
- **Documento**: [08-reputacion-usuario.md](08-reputacion-usuario.md)

---

### Fase 4 — Crecimiento (P2/P3)

#### EPIC-09: Notificaciones in-app

- **Prioridad**: P2
- **Esfuerzo**: Medio (2 sprints)
- **Beneficio**: El usuario recibe feedback sobre sus acciones (votos en sus reseñas, reportes resueltos).
- **Alcance**:
  - Tabla `notifications` en DB
  - Endpoint de lectura/marcar como leído
  - Campana en navbar con contador
  - Eventos: voto en tu reseña, reporte resuelto, nueva respuesta (futuro)
- **Criterios de aceptación**:
  - [ ] El usuario ve notificaciones nuevas en la campana
  - [ ] Puede marcar como leído
  - [ ] RLS: solo ve sus propias notificaciones
- **Dependencias**: EPIC-07 (para notificación de reportes resueltos)

#### EPIC-10: Responder reseñas (futuro)

- **Prioridad**: P3
- **Esfuerzo**: Alto (3+ sprints)
- **Beneficio**: Las inmobiliarias pueden responder, generando diálogo.
- **Alcance**:
  - Tabla `review_responses`
  - UI de respuesta en detalle de reseña
  - Solo el creador de la inmobiliaria puede responder
  - Moderación de respuestas
- **Criterios de aceptación**:
  - [ ] Solo el owner de la inmobiliaria responde
  - [ ] La respuesta se muestra debajo de la reseña
  - [ ] Las respuestas pasan por moderación
- **Dependencias**: EPIC-07, sistema de roles

#### EPIC-13: Garantías de alquiler

- **Prioridad**: P2
- **Esfuerzo**: Medio (2-3 sprints)
- **Beneficio**: Los inquilinos pueden explorar, comparar y reseñar proveedores de garantías uruguayos (Anda, Porto, SURA, etc.) antes de contratar.
- **Alcance**:
  - Tablas `guarantee_providers`, `guarantee_reviews`, `guarantee_review_votes`, `guarantee_reports`
  - Seed con al menos 6 proveedores reales uruguayos
  - RPCs de CRUD, votos, favoritos, reportes (patrón replicado de inmobiliarias)
  - Ruta `/garantias` (listado) y `/garantias/:slug` (detalle)
  - Reseñas con rating, votos like/dislike, favoritos y reportes
  - Integración en navbar: link "Garantías"
  - Tests RLS y E2E
- **Criterios de aceptación**:
  - [ ] Tabla `guarantee_providers` con seed de proveedores uruguayos
  - [ ] CRUD de reseñas funcionando con RLS correcto
  - [ ] Votos y favoritos funcionando
  - [ ] Reportes funcionando con el mismo patrón existente
  - [ ] Rutas `/garantias` y `/garantias/:slug` funcionando
  - [ ] Tests RLS y E2E pasan
- **Dependencias**: Ninguna (replica el patrón de inmobiliarias)
- **Documento**: [09-garantias.md](09-garantias.md)

#### EPIC-14: Tips recomendados por usuarios

- **Prioridad**: P2
- **Esfuerzo**: Medio (2-3 sprints)
- **Beneficio**: La comunidad puede proponer y votar tips de alquiler, complementando los tips editoriales del equipo.
- **Alcance**:
  - Tablas `user_tips`, `user_tip_votes`, `user_tip_comments`, `user_tip_reports`
  - Estados del tip: pending, approved, rejected, featured
  - Moderación: tips nuevos entran como pending; el equipo aprueba/rechaza
  - RPCs de CRUD, votos, comentarios, reportes
  - Ruta `/tips/comunidad` y sección integrada en `/tips`
  - Formulario de propuesta de tip
  - Panel en perfil: "Mis tips propuestos"
  - Tests RLS y E2E
- **Criterios de aceptación**:
  - [ ] Tablas con RLS correcto y estados funcionando
  - [ ] Flujo de propuesta → pending → approved/rejected funcionando
  - [ ] Votos y comentarios funcionando
  - [ ] Integración en página de tips principal
  - [ ] Panel en perfil del usuario
  - [ ] Tests RLS y E2E pasan
- **Dependencias**: EPIC-07 (panel de moderación facilita la revisión, pero no bloquea)
- **Documento**: [10-tips-usuario.md](10-tips-usuario.md)

#### EPIC-11: SEO y crecimiento orgánico

- **Prioridad**: P2
- **Esfuerzo**: Medio (2 sprints)
- **Beneficio**: Tráfico orgánico. Ya existe `robots.ts`, `sitemap.ts`, y skill de SEO.
- **Alcance**:
  - Sitemap dinámico con todas las direcciones e inmobiliarias indexadas
  - Meta tags optimizados por página (OpenGraph, Twitter cards)
  - Schema.org structured data (LocalBusiness, Review)
  - Lighthouse audit: score ≥ 90
- **Criterios de aceptación**:
  - [ ] Sitemap incluye todas las URLs indexables
  - [ ] Cada página tiene meta tags únicos
  - [ ] Google Rich Results test pasa para reseñas
  - [ ] Lighthouse performance ≥ 90
- **Dependencias**: EPIC-01 (home con datos reales mejora SEO)

---

## 3. Matriz de Prioridad

```
                    ALTO IMPACTO
                        │
      EPIC-01 (Home)     │     EPIC-07 (Moderación)
      EPIC-15 (Login SS) │
      EPIC-17 (Seguridad)│
      EPIC-04 (Imágenes) │     EPIC-09 (Notificaciones)
     EPIC-02 (Paginación)│    EPIC-08 (Auto-ocultar)
                        │
  ──────────────────────┼──────────────────────
                        │
     EPIC-03 (Content)  │     EPIC-10 (Responder)
     EPIC-05 (Pag RE)   │     EPIC-11 (SEO)
     EPIC-06 (Actividad)│     EPIC-13 (Garantías)
     EPIC-12 (Reputación)│    EPIC-14 (Tips comunidad)
     EPIC-18 (Rend/datos)│
                        │
                    BAJO IMPACTO
     BAJO ESFUERZO ─────┼───── ALTO ESFUERZO
```

**Regla de decisión**: empezar por abajo-izquierda (alto impacto, bajo esfuerzo), luego subir.

---

## 4. Orden de ejecución sugerido

| Sprint | Epic | Dependencias |
|---|---|---|
| Sprint 1 | EPIC-16 (Términos re-aceptación) + EPIC-03 (Consolidar content) + EPIC-02 (Paginación reseñas) | Ninguna |
| Sprint 1.5 | EPIC-15 (Login server-side — resta callback y E2E) | Ninguna |
| Sprint 1.5 | EPIC-17 (Hardening de seguridad) | Ninguna |
| Sprint 2 | EPIC-01 (Home datos reales) | EPIC-03 |
| Sprint 3 | EPIC-05 (Paginación inmobiliarias) + EPIC-06 (Actividad perfil) | EPIC-02 |
| Sprint 3.5 | EPIC-18 (Rendimiento e integridad de datos) | Ninguna |
| Sprint 4-5 | EPIC-04 (Imágenes en reseñas) | Ninguna |
| Sprint 6-8 | EPIC-07 (Panel de moderación) | Ninguna |
| Sprint 9-10 | EPIC-12 (Reputación usuario) | Ninguna |
| Sprint 11 | EPIC-08 (Auto-ocultar) + EPIC-11 (SEO) | EPIC-07 |
| Sprint 12-13 | EPIC-09 (Notificaciones) | EPIC-07 |
| Sprint 14-15 | EPIC-13 (Garantías alquiler) | Ninguna |
| Sprint 16-17 | EPIC-14 (Tips de usuarios) | EPIC-07 |
| Futuro | EPIC-10 (Responder reseñas) | EPIC-07, roles |

---

## 5. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Home con datos reales muestra DB vacía (cold start) | Alta | Medio | Fallback a datos estáticos cuando no hay datos suficientes |
| Imágenes generan costos de storage altos | Media | Bajo | Limitar a 5 por reseña, 5MB max, compresión con sharp |
| Panel de moderación requiere sistema de roles | Alta | Alto | Definir schema de roles antes de empezar (Supabase Auth claims) |
| Paginación rompe búsquedas existentes | Baja | Alto | Tests E2E antes y después |
| Migración de contenido rompe imports | Media | Bajo | Grep de imports antes de mover, tests de build |
| RLS mal configurado en nuevas tablas | Media | Crítico | Script `db:test:rls` en cada migración |
| Usuarios usan la plataforma sin consentir T&C actualizados | Media | Alto | Re-aceptación en vivo en rutas protegidas (EPIC-16) + auditoria de aceptaciones |
| Fotos borradas siguen públicas en R2 (privacidad, Ley 18.331) | Media | Alto | Cola de borrado de R2 (EPIC-17) |
| Producción sin Redis configurado deja la app sin rate limit propio | Baja | Alto | Verificar variables de Upstash en cada deploy; la DB mantiene su propio rate limit en las RPCs |

---

## 6. Métricas de Éxito

### Producto

| Métrica | Baseline actual | Target Fase 1 | Target Fase 3 |
|---|---|---|---|
| Reseñas creadas / semana | — | +30% | +100% |
| Tiempo carga home | ~3s (demo) | <2s (real) | <1.5s |
| Reportes resueltos / semana | 0 (manual) | 5+ | 20+ |
| Usuarios activos mensuales | — | +20% | +50% |

### Técnico

| Métrica | Target |
|---|---|
| Test coverage (vitest) | ≥ 80% |
| E2E coverage (paths críticos) | 100% |
| Lighthouse performance | ≥ 90 |
| Build time | < 3 min |
| Type errors | 0 |

---

## 7. Decisiones Pendientes (abiertas)

| # | Decisión | Opciones | Requiere |
|---|---|---|---|
| D1 | Paginación: infinite scroll vs botones | Scroll = moderno, botones = accesible | Preferencia de UX |
| D2 | Roles: Supabase Auth claims vs tabla `user_roles` | Claims = más rápido, tabla = más flexible | Definición de roles necesarios |
| D3 | Imágenes: Supabase Storage vs S3 directo | Ya tienen ambos configurados | Decisión de infra |
| D4 | Notificaciones: in-app only vs email también | Email = más costoso, in-app = más inmediato | Presupuesto Resend |
| D5 | CMS para contenido estático | Mantener en código vs migrar a Payload/Strapi | Volucidad de cambios de contenido |
| D6 | Garantías: catálogo manual vs usuarios proponen proveedores | Manual = controlado, usuarios = escalable | Alcance del feature |
| D7 | Tips de comunidad: misma página `/tips` vs ruta independiente | Integrado = discoverability, separado = claridad | Decisión de UX |
| D8 | Re-aceptación de términos: inmediata vs grace period | Inmediata = cumple estricto, grace period = menos fricción | Decisión de producto/urbanidad |

---

## 8. Cómo usar este documento

1. **Al inicio de cada sprint**: revisar el epic asignado, sus criterios de aceptación y dependencias.
2. **Al crear un issue de GitHub**: referenciar el EPIC-XX y el sprint.
3. **Al hacer demo**: usar las métricas de éxito para demostrar progreso.
4. **Cada 2 sprints**: revisar la matriz de prioridad — las prioridades pueden cambiar con feedback de usuarios.
