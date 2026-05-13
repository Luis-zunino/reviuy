---
name: Supabase SQL ReviUy
description: Reglas para migraciones, funciones SQL, grants y politicas RLS.
applyTo: 'supabase/**/*.sql'
---

# Reglas para SQL y Supabase

- Mantener prefijos SQL del proyecto: `p_` para parametros y `v_` para variables.
- Para cambios funcionales revisar impacto en RLS, grants, funciones relacionadas y compatibilidad con el resto de migraciones.
- Si cambia la firma de una funcion SQL, actualizar tambien grants y llamadas dependientes.
- Priorizar RPC para operaciones multi-tabla y consistencia transaccional.
- Nunca disenar consultas o vistas publicas que expongan `user_id` u otros datos personales.
- Toda tabla sensible nueva debe tener RLS habilitado y politicas restrictivas.
- Mantener los cambios minimos y consistentes con el orden y convenciones ya existentes en `supabase/migrations`.

Referencias:

- [../../.copilot/coding-standards.md](../../.copilot/coding-standards.md)
- [../../.copilot/security-analysis-anonimato.md](../../.copilot/security-analysis-anonimato.md)
