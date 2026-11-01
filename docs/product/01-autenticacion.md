# Flujo 01 — Autenticación

## Propósito

Dar acceso a la plataforma sin contraseñas, minimizando la fricción de registro y protegiendo la cuenta con verificación de email implícita. El registro y el login son **el mismo flujo**: si el email no existe, se crea la cuenta al ingresar por primera vez.

## Actores

- Visitante anónimo
- Usuario autenticado
- Proveedores externos: Supabase Auth (magic link + Google)

## Acceso

- Ruta: `/login` (pública).
- Si el usuario ya tiene sesión activa e ingresa a `/login`, es redirigido automáticamente a la home.
- Las rutas protegidas (`/profile`, `/review/create`, edición de reseñas/inmobiliarias) redirigen aquí con el parámetro `?redirectTo=...` para volver al destino original tras autenticarse.

## Método 1 — Magic link por email

### Flujo principal

1. El usuario abre `/login` y ve un único campo de email (sin contraseña).
2. Ingresa su email y envía el formulario.
3. Recibe confirmación en pantalla: *"¡Revisá tu correo! Te enviamos un enlace mágico"*.
4. Se activa una espera (cooldown) que bloquea reenviar otro enlace durante un tiempo; el contador persiste aunque recargue la página.
5. El usuario abre el enlace recibido por correo.
6. La app procesa el callback en `/auth/callback`:
   - Si ya aceptó los términos vigentes → mensaje *"¡Bienvenido!"* y aterrizaje en la home.
   - Si nunca los aceptó (o cambió de versión) → redirect a `/auth/accept-terms`.

### Excepciones

| Situación | Comportamiento |
|---|---|
| Reenvío antes del cooldown | Botón bloqueado; si Supabase devuelve rate limit (429), se avisa *"Esperá un par de minutos…"* y se sugiere revisar spam. |
| Enlace inválido/expirado | Callback muestra error de autenticación y devuelve a `/login`. |
| Error inesperado en callback | Toast de error genérico + retorno a `/login`. |

## Método 2 — Google OAuth

1. El usuario presiona "Continuar con Google" en `/login`.
2. Se abre el flujo de Google; al autorizar, vuelve por el mismo callback `/auth/callback`.
3. Sigue idéntico comportamiento de términos que el magic link.

## Gate de términos y condiciones (obligatorio, primer ingreso)

Todo usuario recién autenticado pasa por `/auth/accept-terms`:

1. Se muestra resumen de secciones clave + texto completo de los términos.
2. El botón "Aceptar y continuar" está **deshabilitado** hasta que el usuario scrollee hasta el final del texto completo.
3. Al aceptar, la firma se guarda **server-side** en `app_metadata` (`terms_accepted_at` + `terms_version`) vía la server action `acceptTermsAction` — service role; el usuario no puede firmar por su cuenta con la anon key.
4. Redirección a la home.

Reglas:

- No autenticado en esta página → devuelto a `/login`.
- Usuario que ya aceptó → redirigido directo a la home.
- Si cambia la versión de términos (`CURRENT_TERMS_VERSION`), todos los usuarios vuelven a pasar por este gate en su próximo login.

## Cierre de sesión

1. Usuario autenticado abre el menú hamburguesa del navbar.
2. Selecciona "Cerrar sesión" (acción marcada como destructiva).
3. La sesión termina y el usuario vuelve al estado anónimo (los links de perfil desaparecen del menú).

## Reglas de negocio

- No existe recuperación de contraseña porque no hay contraseñas.
- La protección de rutas ocurre en middleware a nivel servidor: valida la sesión contra Supabase y la renueva si está vencida, antes de mostrar la página.
- Tras loguearse, cualquier `redirectTo` pendiente lleva al usuario a donde intentaba ir originalmente.

## Referencias técnicas

- Página login: `src/app/(auth)/login/page.tsx`
- Lógica login + cooldown: `src/components/features/Login/hooks/useLogin.hook.ts`
- Callback: `src/app/auth/callback/page.tsx`
- Gate de términos: `src/components/features/AcceptTerms/AcceptTerms.tsx`, action `src/modules/profiles/presentation/accept-terms.actions.ts`, comparación de versión `src/shared/auth/terms.util.ts`, constantes en `src/constants/legal-terms.constant.ts`
- Middleware de rutas protegidas: `middleware.ts`
