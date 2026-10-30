# Testeo del flujo — Login y logout

> Relación: `docs/12-testing-migracion-auth.md` cubre el setup y la matriz del cambio completo. Esta guía es la receta paso a paso **por flujo** del login.

## Qué cambió en la migración (y qué testear por eso)

1. Magic link/Google hoy vía **server actions** (`src/shared/auth/auth-server-actions.ts`): la UI ya no habla con `supabase.auth` ⇒ cualquier test que mockee `AuthProvider.signIn*` quedó obsoleto y debe mockear las server actions.
2. El redirect del magic link es **absoluto** (`get-server-origin.util.ts`). Antes resolvía al dominio de prod.
3. El cooldown de la UI fue eliminado; el límite es el Redis `auth_email` 5/min. Si vuelve a aparecer un contador "Esperá Ns", es una **regresión**.
4. Cookie de sesión la escribe `@supabase/ssr` (middleware + server client).
5. `signOut` sigue client-side (`AuthProvider.tsx`).

## Prerequisitos

- Stack local: `npx supabase start` (o `pnpm supabase:setup`) + `pnpm dev`.
- Inbucket: `http://127.0.0.1:54324`.
- Upstash configurado (si no, los limiters lanzan).
- (Para Google real) ver limitación en §4.5 de `12-testing-migracion-auth.md`.

## 1. Login por magic link

### Pasos

1. `/login` → escribir email → enviar.
2. ✅ Toast: *"¡Revisá tu correo! Te enviamos un enlace mágico"* — sin botón de cooldown visible.
3. Inbucket → abrir el mail → clickear el magic link.
4. 🔥 Verificar URL destino del mail: `http://localhost:3000/auth/callback?...` — **nunca** dominio de prod ni `*.vercel.app` (regresión #1 del PR).
5. ✅ Aterrizar en `/` (o `/auth/accept-terms` si es la primera vez — ver §3).
6. ✅ Navbar con links de perfil; cookie `sb-127-auth-token` creada.

## 2. Rate limit de Google

> 🔥 La key del limiter debe ser **por IP** (`auth:google:<ip>`). Si en otra PR vuelve a `auth:google` global, un único atacante agota el OAuth de todos.

## 3. Primer login — gate de términos

1. Email nuevo → magic link.
2. ✅ Callback lleva a `/auth/accept-terms` (no a la home).
3. Botón "Aceptar y continuar" **deshabilitado** hasta scrollear el texto completo.
4. Al aceptar → home, toast de bienvenida.
5. Reloguear con el mismo email → **no** vuelve al gate (versión vigente).

## 4. login — casos borde y subflujos

### 4.1 Entrada de email (validaciones)

| # | Caso | Resultado esperado |
|---|---|---|
| L1 | Email con mayúsculas (`Test@X.com`) | normalizado a minúsculas: llega igual a Supabase y al key Redis (`auth:email:test@x.com`) |
| L2 | Email con espacios al inicio/fin | el zod los trimmea o rechaza — ⏳ confirmar en `formLoginSchema` |
| L3 | Email inexistente | igualmente se envía el magic link (signup implícito) — **no** hay enumeración de cuentas |
| L4 | Email vacío | validación client, sin llamar a la action |
| L5 | Formato inválido | mensaje del zod |
| L6 | Usuario ya autenticado que abre `/login` | redirect a `/` (middleware) |

### 4.2 Rate limits (3 capas de rechazo posible)

| # | Fuente | Condición | Efecto observable |
|---|---|---|---|
| L7 | Redis `auth_email` (5 / 1m por email) | 6to envío del mismo email dentro de la ventana | 429 → toast *"Esperá un par de minutos…"* |
| L8 | Redis `auth_oauth` (10 / 1m por IP) | clics en "Continuar con Google" desde el mismo IP | toast de rate limit |
| L9 | Supabase local `email_sent=2/h` | 3er OTP en una hora (solo local) | 429 de Supabase — mismo toast, fuente distinta (gotcha 1.3) |
| L10 | Supabase prod | spam persistente | rechazo por cuota propia del proyecto; el Redis no lo absorbe |

### 4.3 Subflujo del callback (magic link)

| # | Caso | Resultado esperado |
|---|---|---|
| L11 | Link abierto en un navegador/distinto device (PKCE) | exchange falla por mismatch de `code_verifier` → toast error → `/login` |
| L12 | Link reutilizado (OTP de un solo uso) | 2ndo uso rechazado → error en callback |
| L13 | Link expirado | idem L11 |
| L14 | Abrir `/auth/callback` sin params | error → `/login` (no crash) |
| L15 | Login con `?redirectTo=/profile` | tras el callback aterriza en `/profile`, no en `/` |
| L16 | `?redirectTo=https://evil.com` (open redirect) | no debe navegar fuera del dominio — ⏳ verificar el guard de `PagesUrls` |
| L17 | `CURRENT_TERMS_VERSION` bump entre dos logins | usuario vuelve al gate (equivalente a primer ingreso) |
| L18 | Error de red durante el callback | toast genérico + regreso a `/login` (no queda colgado en "Procesando…") |
| L19 | 2 clicks/aperturas del mismo link | uno completa el login; el resto, con sesión ya activa, termina normal |

### 4.4 Cookies y sesión

| # | Caso | Resultado esperado |
|---|---|---|
| L20 | Cookie `sb-*` editada a mano con basura | `getUser()` falla → tratado como anónimo; ruta protegida redirige (no 500) |
| L21 | Access token expirado (1h) en cookie | middleware refresca (la cookie cambia de valor) y el request pasa |
| L22 | Refresh token revocado (cookie vieja post-logout) | falla → redirect a login |
| L23 | Varias pestañas de la misma sesión | logout en una tab: la otra se normaliza al navegar |
| L24 | Cookie chunked (token largo, múltiples `sb-*-auth-token.N`) | todas las chunks se leen y se limpian al logout |

### 4.5 UI y regresiones

| # | Caso | Resultado esperado |
|---|---|---|
| L25 | Aparece contador "Esperá Ns…" | 🔥 **regresión**: el cooldown client fue eliminado |
| L26 | Doble click en "Enviar enlace" | 1 solo request (guard `loadingRef`), botón disabled durante pending |
| L27 | Doble click en "Continuar con Google" | idem |
| L28 | Google devuelve error (provider caído) | toast con mensaje legible, no stack |
| L29 | La action devuelve pero el redirect no dispara | catch muestra toast; botón re-habilitado |

## 5. Logout — casos borde

| # | Caso | Resultado esperado |
|---|---|---|
| O1 | Menú → "Cerrar sesión" | links de perfil desaparecen; cookie `sb-*` borrada |
| O2 | Logout y luego back-forward cache del browser | al navegar de nuevo a `/profile`, middleware pide login (no queda sesión fantasma) |
| O3 | Doble click en logout | idempotente (dos signOut seguidos no explotan) |
| O4 | Logout con red offline | error propagado como toast; la cookie local se intenta limpiar igual — ⏳ verificar |
| O5 | Eliminar cuenta vs logout | delete requiere sesión vigente; después no se puede re-loguear |

## 6. Cobertura en suites

| Nivel | Suite | Qué cubre |
|---|---|---|
| Unit | `auth-server-actions.test.ts` | rate limits, redirect absoluto, key por IP, lowercase |
| Unit | `get-server-origin` / `get-client-ip` tests | headers proxy, fallbacks |
| Unit | `useLogin.hook.test` + `login-flow` + `page.test` | toasts, 429, doble submit, normalización |
| Unit | `AuthProvider.test.tsx` | contrato del contexto (sin signIn, con signOut) |
| E2E | `e2e/specs/auth.spec.ts` | form, rutas protegidas, sesión activa, `/login`→`/` |
| E2E | `k6/journeys/auth-callback.js` | performance del callback |
| Manual | §§1–5 | happy paths + todos los bordes L/O |

## Referencias técnicas

- Server actions: `src/shared/auth/auth-server-actions.ts`
- Origin/IP: `src/shared/auth/get-server-origin.util.ts`, `src/shared/auth/get-client-ip.util.ts`
- Rate limits de auth: `src/lib/redis/rate-limit.ts` (`auth_email` 5/min, `auth_oauth` 10/min)
- UI: `src/components/features/Login/`, `src/components/providers/AuthProvider.tsx`
- Callback: `src/app/auth/callback/page.tsx`
- Local config: `supabase/config.toml` (Inbucket `:90`, redirects `:122`, `email_sent=2` `:150`)
