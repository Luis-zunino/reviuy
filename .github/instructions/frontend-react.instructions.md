---
name: Frontend React ReviUy
description: Reglas para componentes, hooks y UI en TypeScript y React.
applyTo: 'src/**/*.tsx,src/components/**/*.ts,src/hooks/**/*.ts,src/services/apis/**/*.ts,src/lib/**/*.ts'
---

# Reglas para frontend y React

- Mantener componentes de UI enfocados en presentacion; la logica de negocio debe vivir en server actions, hooks o servicios.
- En formularios usar React Hook Form con `zodResolver` y schemas definidos en `src/schemas`.
- No hacer `fetch` directo en componentes si ya existe el patron del proyecto con actions o hooks en `src/services/apis`.
- Tipar props, retornos y contratos publicos de forma explicita.
- No introducir `any` salvo justificacion excepcional y explicita.
- Mantener naming consistente: componentes en `PascalCase.tsx`, hooks en `use*.hook.ts`.
- En mutations con TanStack Query invalidar queries relevantes en `onSuccess`.
- Preservar los patrones visuales y de arquitectura existentes; no mezclar detalles de Supabase o backend dentro de componentes presentacionales.

Referencias:

- [../../.copilot/coding-standards.md](../../.copilot/coding-standards.md)
- [../../.copilot/security-analysis-anonimato.md](../../.copilot/security-analysis-anonimato.md)
