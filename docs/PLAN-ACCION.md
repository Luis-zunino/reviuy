# Plan de Acción — ReviUy

> **Fecha:** 2026-10-18 · **Total:** 37 tareas · **Esfuerzo estimado:** ~31.5 días
> Cómo usarlo: marcar `Estado` a medida que avanza (`Pendiente` → `En curso` → `Hecho`), y agregar el ID de la tarea al commit/PR correspondiente.

---

## Contexto del proyecto

| Aspecto | Estado actual (oct 2026) |
|---|---|
| **Proyecto** | ReviUy — plataforma de reseñas de alquileres e inmobiliarias en Uruguay |
| **Stack** | Next.js App Router + TypeScript + Supabase (Postgres 17, RLS) + Tailwind/Radix; deploy en Vercel |
| **Arquitectura** | Monolito modular en `src/modules/*` (addresses, content, moderation, profiles, property-reviews, real-estates). La capa legacy `src/services` ya fue retirada. |
| **Base de datos** | 16 migraciones (001–016); suite RLS pgTAP con 53 tests; auditoría 2026-05-24 con 0 hallazgos abiertos (6 aceptados de severidad baja) |
| **Testing hoy** | 214 archivos Vitest (umbrales bajos: 5% lines) · 12 specs Playwright / 42 tests · tests RLS **NO** corren en CI · scripts `db:test:*` rotos |
| **CI/CD hoy** | `ci.yml` (quality + e2e), codeql semanal, security-owasp (Semgrep + ZAP a staging), load-test semanal con 10 journeys k6 |
| **Riesgos abiertos** | e2e puede pasar en CI sin auth real (env vars placeholder) · scripts `db:test:*` apuntan a `scripts/` inexistente · husky sin hooks · ~30 PRs de Dependabot sin merge · README con ~10 links rotos |
| **Deuda técnica** | ~60 paquetes desactualizados (Vitest 5, Sentry 11, TS 7, next 16.4) · 15+ overrides de seguridad · CSP con `unsafe-inline` · shadcn en `dependencies` |
| **Pendientes de producto** | content parcial (FAQ/tips institucionales) · sin cola ni panel de moderación · profiles sin actividad/historial · notify de load-test sin Slack |

### Prioridades

| | Significado |
|---|---|
| **P0** | Riesgo activo o bloqueante: hacer ya |
| **P1** | Alto impacto: hacer en los próximos sprints |
| **P2** | Importante pero no urgente: programar |
| **P3** | Nice to have: cuando quede aire |

---

## Fase 0 · Higiene y estabilización — Sprint 1

> Cerrar riesgos que pueden dejar el CI mintiendo: scripts RLS rotos, hooks inertes, e2e sin auth real, ramas/PRs huérfanos.

| ID | Tarea | Categoría | Prioridad | Esfuerzo | Deps | Criterio de finalización | Estado |
|---|---|---|---|---|---|---|---|
| F0-01 | Merge de `fix/update-packages` a develop (pnpm 12.14 + lockfile refrescado) | Dependencias | P0 | 0.5 d | — | PR mergeado en develop sin romper CI (type-check, lint, test, build) | En curso |
| F0-02 | Resolver stash de `feat/update-migrations` y fusionar/eliminar ramas locales sin merge (`feat/update-migrations`, `feat/complete-privacy-policy`) | Git | P0 | 0.5 d | — | Stash aplicado o descartado; ramas fusionadas y borradas | Pendiente |
| F0-03 | Reparar scripts `db:test:rls` y `db:test:static` (`package.json` apunta a `scripts/` que no existe) | Testing | P0 | 0.5 d | — | `pnpm db:test:rls` y `pnpm db:test:static` corren localmente y pasan | Pendiente |
| F0-04 | Activar tests RLS (pgTAP, 53 tests) en CI — hoy no corren en ningún workflow | CI/CD | P0 | 1 d | F0-03 | Job en `ci.yml` ejecuta `db:test:security` y falla el PR si hay regresión RLS | Pendiente |
| F0-05 | Auditar migración 016 (posterior a la auditoría de 2026-05-24) con el suite RLS | Seguridad BD | P0 | 0.5 d | F0-04 | Suite pgTAP pasa con la migración 016 aplicada; hallazgos registrados | Pendiente |
| F0-06 | Arreglar `.pre-commit-config.yaml`: reemplaza `yarn` por `pnpm` | DevEx | P0 | 0.25 d | — | pre-commit corre sin error de comando no encontrado | Pendiente |
| F0-07 | Crear `.husky/pre-commit` real (lint-staged + gitleaks) o retirar husky/lint-staged del repo | DevEx | P0 | 0.25 d | F0-06 | El hook se ejecuta en cada commit o fue removido por completo | Pendiente |
| F0-08 | Depurar ~30 PRs de Dependabot abiertos (merge por lotes o cerrar obsoletos) | Dependencias | P0 | 1 d | F0-01 | Ningún PR de Dependabot con más de 1 semana de antigüedad | Pendiente |
| F0-09 | Arreglar e2e en CI: `global-setup` skipea auth si faltan env vars y `ci.yml` usa placeholders → puede pasar sin probar nada | Testing | P0 | 0.5 d | — | El job e2e falla si no hay credenciales reales; nunca pasa en verde vacío | Pendiente |

---

## Fase 1 · Documentación y configuración — Sprint 2

> README con ~10 links rotos a `docs/` inexistentes; `.env.example` desalineado; Sonar y Gitleaks sin cablear.

| ID | Tarea | Categoría | Prioridad | Esfuerzo | Deps | Criterio de finalización | Estado |
|---|---|---|---|---|---|---|---|
| F1-01 | Decidir destino de `docs/`: crear el mínimo (SETUP, DEPLOYMENT, architecture) o eliminar los ~10 links rotos del README | Docs | P1 | 1 d | — | Todos los links del README resuelven a archivos existentes | Pendiente |
| F1-02 | Actualizar `.env.example`: faltan `R2_*` (5), `SENTRY_AUTH_TOKEN`, `NEXT_PUBLIC_SENTRY_DSN`, `PLAYWRIGHT_BASE_URL`; sobran `GOOGLE_*` sin uso | Config | P1 | 0.25 d | — | `.env.example` refleja 1:1 las variables usadas en `src/` | Pendiente |
| F1-03 | Actualizar `.github/copilot-instructions.md` (menciona `src/app/_actions/` que ya no existe; las actions viven en `src/modules/*/presentation/`) | Docs | P1 | 0.25 d | — | Instrucciones coinciden con la arquitectura modular actual | Pendiente |
| F1-04 | Decidir sobre SonarQube: habilitar workflow de CI o retirar `sonar-project.properties` y la dependencia | CI/CD | P1 | 0.5 d | — | Decisión documentada y ejecutada (activa o eliminada) | Pendiente |
| F1-05 | Agregar Gitleaks a CI (hoy solo está en pre-commit, que además está inerte) | Seguridad | P1 | 0.5 d | F0-07 | Workflow gitleaks corre en PRs | Pendiente |

---

## Fase 2 · Calidad de testing — Sprint 2-3

> Cobertura real: umbrales de coverage, API routes y domain sin tests, e2e de moderación e inmobiliarias.

| ID | Tarea | Categoría | Prioridad | Esfuerzo | Deps | Criterio de finalización | Estado |
|---|---|---|---|---|---|---|---|
| F2-01 | Subir umbrales de cobertura (hoy: lines 5%, statements 5%) a objetivo progresivo (sugerido 60% lines en 3 meses) | Testing | P1 | 0.5 d | — | Umbrales actualizados en `vitest.config.ts` y CI los enforcea | Pendiente |
| F2-02 | Tests unitarios para API routes (`/api/contact`, `/api/report-*`) — hoy sin cobertura | Testing | P1 | 1.5 d | F2-01 | Cobertura de `src/app/api/**` >= 70% | Pendiente |
| F2-03 | Tests para carpetas `domain/` de los 6 módulos (hoy sin tests) | Testing | P1 | 1 d | F2-01 | Cada módulo tiene tests de domain | Pendiente |
| F2-04 | E2e faltantes: creación de review de inmobiliaria y flujo de reportes/moderación | Testing | P1 | 1.5 d | F0-09 | Specs nuevos corriendo en CI | Pendiente |
| F2-05 | Corregir mojibake/encoding (acentos rotos) en `.pre-commit-config.yaml`, cabeceras de migraciones y comentarios SQL | DevEx | P2 | 0.25 d | — | Archivos legibles; formato verificado tras fix | Pendiente |

---

## Fase 3 · Producto — Sprint 3-5

> Completar lo comprometido en los READMEs: módulo content (FAQ/tips/institucional), cola de moderación, historial de perfil.

| ID | Tarea | Categoría | Prioridad | Esfuerzo | Deps | Criterio de finalización | Estado |
|---|---|---|---|---|---|---|---|
| F3-01 | Mover FAQ a queries de `content` (hoy vive dispersa en `src/components/features/FAQ` con tipos locales) | Producto | P1 | 1 d | — | FAQ consumida desde content; features sin lógica propia | Pendiente |
| F3-02 | Mover tips/guías a queries de `content` (hoy es mock estático en `content/data/tips.mock.ts`) | Producto | P1 | 1 d | — | Tips con owner en content y data como seed/fixture | Pendiente |
| F3-03 | `content` como owner del contenido institucional (about, good-practices, términos, privacidad) | Producto | P2 | 1 d | F3-01 | `src/modules/README.md` deja de marcar content como "Parcial" | Pendiente |
| F3-04 | Cola/panel de moderación: hoy `moderation` solo crea reportes; no hay proceso de revisión (declarado como futuro en su README) | Producto | P1 | 5 d | — | Un moderador puede listar reportes, tomar acción y la acción queda auditada | Pendiente |
| F3-05 | Actividad/historial del usuario en `profiles` (pendiente declarado en `profiles/README.md`) | Producto | P2 | 2 d | — | Vista de actividad con reseñas, votos y reportes propios | Pendiente |
| F3-06 | Consolidar el resumen de perfil en una query agregada (hoy N+1; pendiente declarado) | Performance | P2 | 1 d | F3-05 | Resumen de perfil resuelto en 1 query | Pendiente |
| F3-07 | Notificación Slack/email en el job `notify` de `load-test.yml` (hoy solo loguea) | CI/CD | P2 | 0.5 d | — | Alerta real recibida tras un run del load test | Pendiente |

---

## Fase 4 · Dependencias y deuda técnica — Continuo

> ~60 paquetes desactualizados en oleadas controladas + overrides de seguridad + CSP.

| ID | Tarea | Categoría | Prioridad | Esfuerzo | Deps | Criterio de finalización | Estado |
|---|---|---|---|---|---|---|---|
| F4-01 | Oleada 1: actualizar Vitest 4→5 y `@vitest/coverage-v8` | Dependencias | P2 | 1 d | F0-01 | `pnpm type-check`, lint y test verdes con Vitest 5 | Pendiente |
| F4-02 | Oleada 2: `@sentry/nextjs` 10→11 | Dependencias | P2 | 0.5 d | F4-01 | Sentry captura eventos de prueba en dev | Pendiente |
| F4-03 | Oleada 3: TypeScript 6→7 (tras validar compatibilidad Next/ESLint) | Dependencias | P2 | 1 d | F4-01 | type-check y build verdes en TS 7 | Pendiente |
| F4-04 | Oleada 4: next 16.4 + react 19.3 + resto de minors (framer-motion, resend, @supabase/ssr, lucide, shadcn CLI) | Dependencias | P2 | 0.5 d | F4-01 | Build y e2e verdes; sin regresiones visuales | Pendiente |
| F4-05 | Housekeeping: shadcn a devDependencies; eliminar condición muerta `unoptimized` en `next.config.ts:33`; newline final en package.json | Limpieza | P3 | 0.25 d | — | `pnpm lint` y build verdes | Pendiente |
| F4-06 | Revisar los ~15 overrides de seguridad en `pnpm-workspace.yaml` (quitar los ya resueltos upstream) | Seguridad | P2 | 0.5 d | F4-04 | `pnpm audit` limpio con menos overrides | Pendiente |
| F4-07 | Endurecer CSP (hoy usa `unsafe-inline` en `middleware.ts`) con nonces de Next.js — ref: EPIC-17 ROADMAP; el caso de uso es la cookie `sb-*-auth-token` (`httpOnly:false`, con refresh token): un XSS roba sesión renovable | Seguridad | P2 | 1 d | F4-04 | App funciona con CSP sin `unsafe-inline` | Pendiente |

---

## Fase 5 · Operaciones y deploy — Sprint 5+

> Alinear BD remota, documentar despliegue real (Vercel/staging) y salir de `*.vercel.app`.

| ID | Tarea | Categoría | Prioridad | Esfuerzo | Deps | Criterio de finalización | Estado |
|---|---|---|---|---|---|---|---|
| F5-01 | Verificar estado real de migraciones vs Supabase remoto (`supabase migration list`) y alinear | BD | P2 | 0.5 d | — | Migraciones locales y remotas alineadas | Pendiente |
| F5-02 | Documentar despliegue staging (`staging.reviuy.app`) y producción en `docs/operations/DEPLOYMENT.md` | Docs | P2 | 1 d | F1-01 | Runbook de deploy reproducible de punta a punta | Pendiente |
| F5-03 | Runbook de incidentes mínimo (Sentry + monitoreo + rollback de migraciones) | Docs | P2 | 1 d | F5-02 | Runbook revisado con un escenario simulado | Pendiente |
| F5-04 | Dominio propio + headers de seguridad (hoy solo `*.vercel.app`; evaluar HSTS y headers en next.config) | Infra | P3 | 0.5 d | F5-02 | App sirve en dominio propio con headers verificados | Pendiente |
| F5-05 | Barrido de seguridad fresco (`arch-reviewer` completo + revisión de RLS de las migraciones actuales) sobre la rama migrada, después del merge: la rama trajo ~100 commits, puede haber hallazgos nuevos en lo que cambió | Seguridad | P2 | 0.5 d | - | Sweep sin hallazgos críticos/altos nuevos; los medios/bajos van a EPIC-17 | Pendiente |

---

## Resumen de esfuerzo

| Fase | Tareas | Días | Cuándo |
|---|---|---|---|
| Fase 0 · Higiene y estabilización | 9 | 5 | Sprint 1 |
| Fase 1 · Documentación y configuración | 5 | 2.5 | Sprint 2 |
| Fase 2 · Calidad de testing | 5 | 4.75 | Sprint 2-3 |
| Fase 3 · Producto | 7 | 11.5 | Sprint 3-5 |
| Fase 4 · Dependencias y deuda técnica | 7 | 4.75 | Continuo |
| Fase 5 · Operaciones y deploy | 4 | 3 | Sprint 5+ |
| **Total** | **37** | **~31.5** | |

| Prioridad | Tareas | Días |
|---|---|---|
| P0 | 9 | 5 |
| P1 | 13 | 12.25 |
| P2 | 13 | 12.5 |
| P3 | 2 | 0.75 |
