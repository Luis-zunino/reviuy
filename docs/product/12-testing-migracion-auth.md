# Flujo 12 — Testeo de la migración de auth a server-side

> **Alcance:** cómo verificar cada pieza de la migración del flujo de autenticación (Supabase + Next.js) al lado del servidor: server actions, middleware, rate limits Redis, derivación de origin/IP y redirects. Cubre unitario, e2e, manual en local y verificación en deploy.
>
> **Referencia del flujo:** `docs/product/01-autenticacion.md`.

## 0. Mapa del cambio — qué se movió a dónde

| # | Pieza | Antes (client-side) | Ahora (server-side) | Archivo |
|---|---|---|---|---|
| 1 | Emisión de magic link | `supabaseClient.auth.signInWithOtp` en el browser | Server action + rate limit Redis | `src/shared/auth/auth-server-actions.ts` |
| 2 | Emisión de OAuth Google | `supabaseClient.auth.signInWithOAuth` en el browser | Server action + rate limit por IP | idem |
| 3 | Validación de sesión en rutas | Middleware manual (base64 hand-rolled + fetch propio) | `createServerClient` de `@supabase/ssr` + `getUser()` | `middleware.ts` |
| 4 | Redirect destino del magic link | Relativo (resolvía al Site URL del dashboard = prod) | Absoluto, derivado de headers del request | `src/shared/auth/get-server-origin.util.ts` |
| 5 | Rate limit login | Cooldown client-side (bypassable) | Redis (Upstash), incircunvable | `src/lib/redis/rate-limit.ts` |
| 6 | Redirects allowlist local | Solo `127.0.0.1` | `localhost` + `127.0.0.1` + `/auth/callback` | `supabase/config.toml` |
| 7 | Cierre de sesión | Client-side | **Siguió client-side** (decisión: `signOutServer` eliminado por redundante) | `src/components/providers/AuthProvider.tsx` |

## 1. Prerequisitos del entorno

### 1.1 Variables (`.env.local`)

| Variable | Valor en dev | Para qué |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `http://127.0.0.1:54321` | Cliente server, middleware y nombre de cookie de sesión |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | key local | idem |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | credenciales Upstash reales | Rate limiters (`rate-limit.ts` lanza si faltan) |

### 1.2 Servicios

```bash
pnpm supabase:setup        # o: npx supabase start && npx supabase db reset
pnpm dev                   # app en http://localhost:3000
```

- **Inbucket (mail catcher local):** `http://127.0.0.1:54324` — acá llegan todos los magic links en dev. Config: `supabase/config.toml:90`.
- **Redis:** los limiters usan Upstash real; no hay stub local. Si falta env, `getRateLimiter()` lanza y el login email/Google falla con error claro (los tests unitarios mockean Redis).

### 1.3 Gotchas del entorno local

1. **`auth.rate_limit.email_sent = 2` por hora** (`supabase/config.toml:150`): al **3er** OTP dentro de una hora, el Supabase local rechaza con su propio 429 (independiente del Redis). Dispara el mismo path de UI, pero puede confundir al medir el límite del Redis (5/min). Si la ventana quedó contaminada: `supabase db reset`, o comentar la línea y resetear.
2. **Nombre de cookie de sesión:** `@supabase/ssr` lo deriva del host de la **URL de Supabase**, no del host de la app. Con la URL local `127.0.0.1:54321` la cookie es `sb-127-auth-token`; contra producción, `sb-<ref>-auth-token`. Al inspeccionar en DevTools, buscar el prefijo correcto.
3. **`localhost` ≠ `127.0.0.1` para GoTrue:** la allowlist matchea exacto. La app corre en `localhost:3000` y el server action genera `http://localhost:3000/auth/callback` — por eso `config.toml` incluye ambos.

## 2. Nivel 1 — Tests unitarios (Vitest)

```bash
pnpm vitest run src/shared/auth src/lib/redis        # suites del cambio
pnpm test                                            # suite completa
pnpm test:fast                                       # full sin aislamiento (más rápido)
```

### 2.1 Server actions — `src/shared/auth/__tests__/auth-server-actions.test.ts`

| Test | Garantiza |
|---|---|
| rate limit con email en minúsculas | `withRateLimit('auth:email:test@example.com', 'auth_email')` — key consistente aunque el usuario escriba mayúsculas |
| lowercases the email | Supabase recibe el email normalizado |
| success / error propagado | `{ success: true }` o el `AuthError` crudo ante fallo de Supabase |
| calls `createSupabaseServerClient` | siempre usa el cliente de servidor, nunca el del browser |
| Google por IP | `withRateLimit('auth:google:203.0.113.5', 'auth_oauth')` — key **por IP**, no global (regresión del DoS de OAuth global) |
| Google redirect absoluto | `redirectTo: 'http://localhost:3000/auth/callback'` — regresión del bug "el magic link manda a producción" |

### 2.2 Derivación de origin — `get-server-origin.util.test.ts`

| Test | Garantiza |
|---|---|
| usa `x-forwarded-host` + `x-forwarded-proto` | funciona en Vercel/preview, no solo en dev |
| proto múltiple (`https,http`) | toma el primero (`https`) |
| host fallback + `http` en localhost | estable en dev sin proxy |
| https para host no local | prod sin header de proto sigue siendo https |
| fallback `localhost:3000` | un request sin headers no explota |

### 2.3 Derivación de IP — `get-client-ip.util.test.ts`

- Primera IP de `x-forwarded-for` (formato "client, proxy1, proxy2").
- Fallback `x-real-ip`; fallback final `unknown` (los `unknown` comparten bucket — aceptado: solo ocurre en requests sin ningún header de proxy).

### 2.4 Rate limiters — `src/lib/redis/__tests__/rate-limit.test.ts`

- 5 limiters exactos (`vote`, `write`, `sensitive`, `auth_email`, `auth_oauth`) — el count del test **fallaría** si reaparece `auth_refresh` (limiter muerto eliminado).
- Cache por tipo (1 solo `Redis.fromEnv()`), y error explícito sin credenciales Upstash.

### 2.5 Helpers de server actions (pre-existentes, siguen de pie)

- `assert-authenticated.util.test.ts` — devuelve el userId, o lanza `UNAUTHORIZED` con mensaje custom.
- `create-server-action-deps.util.test.ts` — entrega supabase + `getCurrentUserId` + `rateLimit` como deps.
- `useAuthMutation.hook.test.tsx` — wrapper client de mutations autenticadas.

### 2.6 UI de login (client que consume lo migrado)

| Suite | Cubre |
|---|---|
| `useLogin.hook.test.tsx` | el hook llama `signInWithEmailServer`/`signInWithGoogleServer`, toasts de éxito/error, mensaje 429, guard `loadingRef` contra doble submit |
| `login-flow.test.tsx` | integración del form: click Google → server action + redirect; email → toast "¡Revisá tu correo!"; error → toast |
| `(auth)/login/page.test.tsx` | la página renderiza el feature con metadata/fuentes |
| `AuthProvider.test.tsx` | el contexto **ya no** expone `signInWithEmail`/`signInWithGoogle`; solo `loading`/`isAuthenticated`/`signOut` |

## 3. Nivel 2 — E2E con Playwright (`e2e/specs/auth.spec.ts`)

```bash
pnpm test:e2e -- e2e/specs/auth.spec.ts
```

| Test | Qué verifica |
|---|---|
| elementos del form presentes | login renderiza email + Google + submit |
| `/profile`, `/review/create` → `/login` sin sesión | guard del middleware para rutas anónimas |
| `/profile` carga con sesión (fixture `authPage`) | cookies frescas inyectadas por `auth.helper.ts` → el middleware valida el JWT real |
| `/login` → `/` con sesión | `middleware.ts` redirige al usuario autenticado fuera del login |
| `/review/create` sin redirect con sesión | idem |

**Gaps que esta suite NO cubre** (no automatizados, se cubren en la sección 4):
- Magic link happy-path real (depende de recibir email).
- OAuth Google real (depende de consent screen).
- Rate limit 429 (no es idempotente para CI).
- Logout.

## 4. Nivel 3 — Verificación manual del flujo completo (local)

Checklist en orden; cada bloque es independiente.

### 4.1 Magic link — happy path (test clave del bug del dominio prod)

1. `pnpm dev` + stack local arriba.
2. `/login` → email → *"¡Revisá tu correo!"*.
3. Abrir **Inbucket** (`http://127.0.0.1:54324`) → abrir el mail → mirar el link de destino:
   **debe** ser `http://localhost:3000/auth/callback?...` y **nunca** el dominio de producción ni una URL `*.vercel.app`. Si eso falla, es la regresión #1 del PR.
4. Click en el enlace → el callback procesa y aterriza en `/` (o `/auth/accept-terms` si es usuario nuevo — ver 4.8).

### 4.2 Rutas protegidas + `redirectTo`

1. Modo incógnito → `http://localhost:3000/profile` → debe aterrizar en `/login?redirectTo=/profile`.
2. Ingresar el mismo email → abrir el mail de Inbucket → el enlace completa el login;
   verificar que la app respete `redirectTo`: **debe** terminar en `/profile`, no en `/`.
3. Si no respeta: verificar cómo `AuthCallback` y el gate de términos manejan el `redirectTo` guardado en el callback.

### 4.3 Rate limit email (Redis)

1. Enviar OTPs seguidos: los primeros 5 dentro del minuto van OK, a partir del 6º aparece el toast *"Esperá un par de minutos…"* (viene del catch en `useLogin.hook.ts`).
2. Confirmar la fuente correcta del rechazo: la vía rápida es contar envíos — si falla en el 3er correo dentro de una hora, viene de `auth.rate_limit.email_sent` de Supabase local, no del Redis (ver gotcha 1.3).
3. (Opcional) revisar la key en Upstash dashboard: `auth:email:<email>` con TTL ≤ 60s.
4. Reset para re-run: borrar la key en Upstash o esperar a que expire la ventana.

### 4.4 Rate limit OAuth (por IP)

- Local: límite 10 requests/min para la misma IP — difícil de agotar a mano; opción pragmática: hacer los clicks en bucle y contar los que pasan hasta el rechazo.
- Alternativa controlada: en `rate-limit.ts` cambiar temporalmente la ventana (`'1 m'` → `'10 s'`) para el smoke y revertir.

### 4.5 Google OAuth — limitación local

Google OAuth **no se prueba completo en local con el stack**: requiere `external_providers` con client id/secret y una callback pública registrada en Google Console. Testear el flujo real contra **staging/preview** (sección 5). En local verificar al menos:
- Click "Continuar con Google" → hay feedback (loading/error legible si el provider no está configurado).

### 4.6 Middleware — matriz manual

| # | Escenario | Resultado esperado |
|---|---|---|
| 1 | Sin sesión + ruta protegida (`/profile`) | redirect a `/login?redirectTo=/profile` |
| 2 | Sin sesión + ruta pública (`/`) | pasa normal |
| 3 | Con sesión + `/login` | redirect a `/` |
| 4 | Con sesión + ruta protegida | pasa |
| 5 | Access token expirado en cookie + request | el middleware refresca: la cookie `sb-127-auth-token` cambia de valor en DevTools y el request pasa |
| 6 | Cookie truncada/malformada manualmente | `getUser()` falla → se trata como no autenticado → ruta protegida redirige (no 500) |

### 4.7 Logout

1. Menú hamburguesa → "Cerrar sesión".
2. Links de perfil fuera del menú; back to anonymous.
3. Cookies `sb-*` eliminadas (DevTools → Application).
4. `/profile` ahora redirige a `/login`.
5. Reusar un request con la cookie anterior (copy/paste en curl) → 401 del API server-side: el refresh token quedó revocado por Supabase.

### 4.8 Gate de términos (primera vez)

1. Usuario nuevo (email nunca usado) → magic link.
2. Callback → aterrizá en `/auth/accept-terms` (no en home).
3. Botón "Aceptar" disabled hasta scrollear el texto completo.
4. Al aceptar → home. Segundo login directo → home sin gate (coherente con `docs/product/11-terminos-aceptacion.md`).

## 5. Nivel 4 — Verificación en deploy (preview / staging / prod)

| # | Check | Cómo |
|---|---|---|
| 1 | Allowlist Supabase dashboard | Auth → URL Configuration: Site URL = dominio prod; Redirect URLs con prod, `localhost:3000/auth/callback` y previews acotados. Sin esto, Supabase hace fallback al Site URL (el bug original) |
| 2 | Redirect absoluto en preview | Magic link desde la preview URL → el email debe aterrizar en `https://<preview>-reviuy.vercel.app/auth/callback` |
| 3 | Redirect absoluto en prod | idem desde el dominio final |
| 4 | CSP correcta | `curl -sI https://TU-DOMINIO \| grep -i content-security` → `connect-src` contiene la URL real de Supabase |
| 5 | Rate limiter activo | 6 logins con email desde la misma IP dentro del minuto → 429 en el 6º (Upstash compartido entre ambientes: el consumo es global) |
| 6 | Middleware sanity | modo incógnito → `/profile` → login → la app aterriza donde debe; `redirectTo` nunca apunta a un dominio externo |
| 7 | OAuth por IP | lanzar login Google desde 2 dispositivos/IPs distintas: el límite de uno no bloquea al otro |

## 6. Matriz de cobertura — qué protege cada nivel

| Pieza del cambio | Unit (Vitest) | E2E (Playwright) | Manual |
|---|---|---|---|
| Server action OTP | ✅ | — | ✅ 4.1 |
| Server action OAuth | ✅ | — | ✅ (flujo real en staging) |
| Origin absoluto | ✅ | — | ✅ 4.1 + 5.2/5.3 |
| IP por header | ✅ | — | — |
| Rate limiter email | ✅ (mock Redis) | — | ✅ 4.3 |
| Rate limiter OAuth | ✅ (mock Redis) | — | ⚠️ 4.4 (limitado a mano) |
| Middleware guard + refresh | ❌ **sin suite unitaria propia** | ✅ (auth.spec) | ✅ 4.2/4.6 |
| Login UI + toasts | ✅ | ✅ (form presente) | ✅ |
| Logout | ✅ (AuthProvider) | en account.spec | ✅ 4.7 |
| Allowlist / config local | — | — | ✅ 5.1 + gotcha 1.3 |

**Gap declarado #1:** `middleware.ts` no tiene suite unitaria propia — se cubre indirectamente vía e2e y manual. Candidato a tests con mocks de request si el equipo lo quiere formal.

## 7. Cheatsheet

```bash
# suite del cambio
pnpm vitest run src/shared/auth src/lib/redis \
  src/components/features/Login src/components/providers

# e2e de auth
pnpm test:e2e -- e2e/specs/auth.spec.ts

# stack + mail catcher
npx supabase start     # Inbucket en http://127.0.0.1:54324
npx supabase db reset  # limpiar rate limits y ventanas locales

# verificación de headers en deploy
curl -sI https://TU-DOMINIO | grep -i content-security
```

## 8. Qué la suite aún no garantiza (candidatos a PR futura)

1. Tests unitarios de `middleware.ts` (hoy solo e2e + manual).
2. E2E del magic link end-to-end parseando el mail de Inbucket — eliminaría el paso manual 4.1.
3. Test de integración del Redis limiter contra Upstash real en un job de CI separado.
4. OAuth Google real automatizado en staging (requiere consent screen / cuenta de servicio).

## Referencias técnicas

- Server actions: `src/shared/auth/auth-server-actions.ts` (+ `get-server-origin.util.ts`, `get-client-ip.util.ts`)
- Middleware: `middleware.ts` (guard + CSP)
- Rate limits: `src/lib/redis/rate-limit.ts`, scopes en `src/lib/redis/types/rate-limit.types.ts`
- UI login: `src/components/features/Login/`, `src/components/providers/AuthProvider.tsx`
- E2E: `e2e/specs/auth.spec.ts`, fixture `e2e/fixtures/auth.fixture.ts`, helper `e2e/helpers/auth.helper.ts`
- Config local: `supabase/config.toml` (Inbucket `:90`, `auth.rate_limit` `:150`, `additional_redirect_urls` `:122`)
- Flujo funcional: `docs/product/01-autenticacion.md`
