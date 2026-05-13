# ReviUy: instrucciones globales de repositorio

Aplica estas reglas en cualquier cambio de código de este repositorio.

## Contexto del proyecto

- Stack principal: Next.js App Router, TypeScript, React, Supabase, Zod, React Hook Form y TanStack Query.
- Gestor de paquetes: yarn 4.
- Validación mínima antes de cerrar un cambio: `yarn type-check` y `yarn lint`.

## Arquitectura obligatoria

- Server Actions en `src/app/_actions/` para lógica backend y llamadas RPC.
- API Routes en `src/app/api/` solo para webhooks y endpoints públicos.
- Schemas en `src/schemas/` como fuente única de verdad para validación.
- Hooks de datos en `src/services/apis/`.
- Componentes en `src/components/` con separación entre presentación y lógica.
- Types por entidad en `src/types/`.

## Reglas de implementación

- Aplicar principios SOLID; una función o componente debe tener una única responsabilidad.
- No duplicar schemas; extender con `.extend()` cuando corresponda.
- No usar `any` salvo justificación excepcional y explícita.
- Tipar props, retornos y contratos públicos de forma explícita.
- No poner lógica de negocio en componentes de UI.
- No hacer `fetch` directo en componentes si ya existe el patrón de actions o hooks del proyecto.

## Validación y formularios

- Validar siempre con Zod en Server Actions y API Routes.
- En formularios usar React Hook Form con `zodResolver`.
- No hacer validación manual ad hoc si existe schema.

## Base de datos y Supabase

- Para operaciones multi-tabla preferir funciones RPC en lugar de múltiples inserts no atómicos.
- Si cambia la firma de una función SQL, actualizar los grants o migraciones relacionadas.
- Mantener prefijos SQL del proyecto: `p_` para parámetros y `v_` para variables.
- Si se toca SQL, revisar también `supabase/migrations/` y el impacto en RLS.

## Seguridad y privacidad

- Nunca exponer `user_id`, email, teléfono, IP ni otros identificadores personales en consultas públicas.
- Para datos públicos usar vistas o respuestas sanitizadas; preferir `is_mine` antes que exponer ownership directo.
- Toda tabla nueva sensible debe tener RLS habilitado y políticas restrictivas.
- Aplicar rate limiting en Server Actions o endpoints públicos que lo requieran.
- Nunca usar `NEXT_PUBLIC_` para secretos ni exponer `service_role` al cliente.
- Nunca guardar tokens en `localStorage`; usar cookies `httpOnly` cuando aplique.

## Convenciones de nombres

- Componentes: `PascalCase.tsx`.
- Hooks: `use*.hook.ts`.
- Utils: `*.util.ts`.
- Schemas: `*.schema.ts`.
- Enums: `*.enum.ts`.
- Actions: `*.actions.ts`.
- Constantes: `UPPER_SNAKE_CASE`.
- Interfaces de props: `PascalCaseProps`.

## Patrones preferidos

- Server Action: validar con Zod, ejecutar lógica protegida, manejar error centralizado y revalidar path si corresponde.
- Mutations con TanStack Query: invalidar queries relevantes en `onSuccess`.
- Mantener cambios mínimos y consistentes con el estilo existente.

## Anti-patrones prohibidos

- Exponer `user_id` en selects públicos.
- Confiar en IDs o privilegios enviados por el cliente.
- Duplicar schemas o tipos por conveniencia.
- Introducir dependencias circulares.
- Usar `dangerouslySetInnerHTML` sin un caso justificado y seguro.

## Referencias del repositorio

- Guía detallada de estándares: [../.copilot/coding-standards.md](../.copilot/coding-standards.md)
- Análisis de anonimato y privacidad: [../.copilot/security-analysis-anonimato.md](../.copilot/security-analysis-anonimato.md)
- Análisis de seguridad general: [../.copilot/analisis-seguridad.md](../.copilot/analisis-seguridad.md)