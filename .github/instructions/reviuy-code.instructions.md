---
name: Reglas de codigo ReviUy
description: Reglas obligatorias para cambios en TypeScript, React, Next.js y SQL de Supabase.
applyTo: 'src/**/*.ts,src/**/*.tsx,supabase/**/*.sql,middleware.ts,next.config.ts,scripts/**/*.mjs'
---

# Reglas aplicadas al codigo

- Usar Zod como fuente unica de validacion en server actions, api routes y formularios.
- Mantener la separacion arquitectonica del proyecto: schemas en `src/schemas`, actions en `src/app/_actions`, hooks en `src/services/apis`, componentes en `src/components`, tipos en `src/types`.
- No usar `any` ni validacion manual cuando exista un schema.
- No mezclar logica de negocio con componentes de presentacion.
- Para operaciones multi-tabla en Supabase preferir RPC y revisar grants o RLS asociados.
- Nunca exponer `user_id` ni datos personales en consultas publicas; preferir vistas sanitizadas e indicadores como `is_mine`.
- No introducir secretos en variables `NEXT_PUBLIC_` ni almacenar tokens en `localStorage`.
- Si se cambia SQL, revisar migraciones, RLS y compatibilidad de tipos generados.
- Antes de cerrar el cambio, validar con `pnpm type-check` y `pnpm lint` cuando el entorno lo permita.

Esta instruccion define la capa comun del repositorio. Las reglas especificas por dominio viven tambien en:

- `frontend-react.instructions.md`
- `backend-actions.instructions.md`
- `supabase-sql.instructions.md`

Referencias:

- [../../docs/coding-standards.md](../../docs/coding-standards.md)
- [../../docs/security/anonimato.md](../../docs/security/anonimato.md)
