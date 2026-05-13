---
name: Backend Actions ReviUy
description: Reglas para server actions, api routes y logica backend del repositorio.
applyTo: 'src/app/_actions/**/*.ts,src/app/api/**/*.ts,src/app/api/**/*.tsx,src/lib/supabase/**/*.ts,src/utils/**/*.ts'
---

# Reglas para backend

- Validar siempre inputs con Zod antes de ejecutar logica de negocio.
- Mantener la logica protegida en server actions o capas backend; no confiar en privilegios, ids o ownership enviados por el cliente.
- Aplicar rate limiting en acciones o endpoints publicos cuando corresponda.
- Centralizar manejo de errores y no exponer detalles sensibles en respuestas publicas.
- Nunca exponer `user_id`, email, telefono, IP ni otros identificadores personales en payloads o selects publicos.
- Si una operacion afecta multiples tablas, preferir RPC en Supabase antes que inserts encadenados no atomicos.
- No exponer secretos en codigo cliente ni mediante variables `NEXT_PUBLIC_`.

Referencias:

- [../../.copilot/coding-standards.md](../../.copilot/coding-standards.md)
- [../../.copilot/analisis-seguridad.md](../../.copilot/analisis-seguridad.md)
- [../../.copilot/security-analysis-anonimato.md](../../.copilot/security-analysis-anonimato.md)
