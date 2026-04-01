# ReviUy

Plataforma de resenas de alquileres e inmobiliarias en Uruguay, construida con Next.js App Router, TypeScript y Supabase.

## Stack

- Next.js App Router + React + TypeScript
- Supabase (PostgreSQL, Auth, RLS)
- Zod + React Hook Form
- TanStack Query
- Tailwind CSS + Radix UI

## Inicio Rapido

1. Instalar dependencias.

```bash
yarn install
```

2. Configurar entorno.

```bash
cp .env.example .env.local
```

3. Iniciar infraestructura local y aplicar migraciones.

```bash
yarn supabase:start
yarn migrations
yarn supabase:typeLocal
```

4. Ejecutar aplicacion.

```bash
yarn dev
```

## Scripts Principales

```bash
yarn dev
yarn build
yarn start
yarn type-check
yarn lint
yarn lint:fix
yarn format
yarn format:check
```

## Scripts de Supabase

```bash
yarn supabase:start
yarn supabase:stop
yarn supabase:status
yarn supabase:reset
yarn migrations
yarn supabase:migrate
yarn supabase:diff
yarn supabase:typeLocal
```

## Seguridad

Auditoria de dependencias:

```bash
yarn security:deps
```

Auditoria SAST con Semgrep (requiere CLI instalada):

```bash
# macOS
brew install semgrep

# Windows (PowerShell) - requiere Python 3
python -m pip install --user pipx
python -m pipx install semgrep
python -m pipx ensurepath   # luego cerrar/abrir la terminal

# luego ejecutar
yarn security:semgrep
```

Auditoria combinada:

```bash
yarn security:owasp
```

## Arquitectura (resumen)

- Entry points por dominio: src/modules/\*/presentation/
- API Routes publicas/webhooks: src/app/api/
- Schemas Zod: src/schemas/
- Hooks de datos: src/modules/\*/presentation/ y shared para utilidades transversales
- Componentes UI/features: src/components/
- Tipos de dominio: src/types/
- SQL y migraciones: supabase/migrations/

## Estado Arquitectonico

La aplicacion ya esta en una migracion activa hacia monolito modular por dominio.

Estado actual resumido:

- property-reviews y real-estates ya operan con commands, queries y repositorios propios
- addresses ya es owner de la busqueda por nombre y del detalle de direccion
- moderation ya centraliza reportes conectados a server actions y API routes
- profiles ya centraliza auth, session, delete-account, reseñas propias y favoritos del usuario
- content ya centraliza el flujo de contacto
- content tambien concentra el dataset estático de tips en src/modules/content/data/
- shared/auth centraliza useAuthMutation como utilidad transversal
- src/constants/queryKeys.constants.ts centraliza query keys compartidas

La capa legacy src/services fue retirada por completo. Los imports ahora apuntan directo a modulos, shared o constants segun corresponda.

Ver detalle en [src/modules/README.md](src/modules/README.md) y [docs/architecture/MIGRATION_PLAN_TOWARD_TARGET_ARCHITECTURE.md](docs/architecture/MIGRATION_PLAN_TOWARD_TARGET_ARCHITECTURE.md).

## Documentacion

- Centro de documentacion: [docs/README.md](docs/README.md)
- Setup local: [docs/SETUP.md](docs/SETUP.md)
- Variables de entorno: [.env.example](.env.example)
- Seguridad: [security.readme.md](security.readme.md)
- Rate limiting: [docs/security/RATE_LIMITING_IMPLEMENTATION.md](docs/security/RATE_LIMITING_IMPLEMENTATION.md)
- Mejoras de arquitectura: [docs/architecture/ARCHITECTURE_IMPROVEMENTS.md](docs/architecture/ARCHITECTURE_IMPROVEMENTS.md)
- Estado de modulos: [src/modules/README.md](src/modules/README.md)
- Despliegue por entorno: [docs/operations/DEPLOYMENT.md](docs/operations/DEPLOYMENT.md)
- Branching y releases: [docs/process/BRANCHING_AND_RELEASES.md](docs/process/BRANCHING_AND_RELEASES.md)
- Runbook de incidentes: [docs/operations/INCIDENT_RUNBOOK.md](docs/operations/INCIDENT_RUNBOOK.md)
- Documentacion de BD: [docs/database/README.md](docs/database/README.md)
- Brechas documentales: [docs/DOCUMENTATION_GAPS.md](docs/DOCUMENTATION_GAPS.md)

## Validacion Minima Antes de Merge

```bash
yarn type-check
yarn lint
```
