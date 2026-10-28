import { PagesUrls } from '@/enums/pagesUrls.enum';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { hasAcceptedCurrentTerms } from '@/shared/auth/terms.util';

const PROTECTED_ROUTE_PATTERNS = [
  /^\/profile(?:\/|$)/,
  /^\/review\/create(?:\/|$)/,
  /^\/review\/[^/]+\/edit(?:\/|$)/,
  /^\/real-estate\/create(?:\/|$)/,
  /^\/real-estate\/[^/]+\/review\/create(?:\/|$)/,
  /^\/real-estate\/[^/]+\/review\/[^/]+\/update(?:\/|$)/,
  /^\/real-estate\/[^/]+\/update(?:\/|$)/,
];

const AUTH_ROUTE_PATTERNS = [new RegExp(`^${PagesUrls.LOGIN}(?:/|$)`)];

// Rutas que un usuario logueado con términos sin aceptar debe poder visitar:
// el flujo de auth (callback y aceptación) y los textos legales que va a aceptar.
const TERMS_EXEMPT_ROUTE_PATTERNS = [
  /^\/auth(?:\/|$)/,
  new RegExp(`^${PagesUrls.TERMS_AND_CONDITIONS}(?:/|$)`),
  new RegExp(`^${PagesUrls.PRIVACY_POLICY}(?:/|$)`),
];

const matchesRoute = (pathname: string, patterns: RegExp[]) => {
  return patterns.some((pattern) => pattern.test(pathname));
};

const buildCsp = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://apis.google.com https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://placehold.co https://firebasestorage.googleapis.com https://lh3.googleusercontent.com https://*.tile.openstreetmap.org;
    font-src 'self' data:;
    connect-src 'self' ${supabaseUrl} https://*.supabase.co https://firebasestorage.googleapis.com https://vitals.vercel-insights.com https://nominatim.openstreetmap.org;
    object-src 'none';
    base-uri 'self';
    frame-ancestors 'none';
  `
    .replaceAll(/\s{2,}/g, ' ')
    .trim();
};

const withSecurityHeaders = (response: NextResponse, hasSession: boolean) => {
  response.headers.set('Content-Security-Policy', buildCsp());
  // Con sesión la respuesta es personalizada (y puede llevar Set-Cookie del refresh):
  // nunca debe guardarse en un cache compartido.
  response.headers.set(
    'Cache-Control',
    hasSession ? 'private, no-store' : 'public, max-age=0, must-revalidate'
  );
  return response;
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        // Patrón de @supabase/ssr: si se refresca el token, las cookies nuevas van
        // al request (para que server components y server actions de ESTE request
        // no reintenten el refresh con el token viejo, lo que con rotación de
        // refresh tokens puede cerrar la sesión) y también a la respuesta.
        setAll: (cookiesToSet, headers) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
          Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    }
  );

  // getClaims valida el JWT localmente (con claves de firma asimétricas) en lugar de
  // ir al servidor de Auth en cada request como getUser(); refresca la sesión si venció.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const hasSession = Boolean(claims);

  // Los redirects deben conservar las cookies de un posible refresh del token.
  const redirectTo = (url: URL) => {
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return withSecurityHeaders(redirect, hasSession);
  };

  const pathname = request.nextUrl.pathname;
  const isProtected = matchesRoute(pathname, PROTECTED_ROUTE_PATTERNS);
  const isAuthRoute = matchesRoute(pathname, AUTH_ROUTE_PATTERNS);

  if (isProtected && !hasSession) {
    const redirectUrl = new URL(PagesUrls.LOGIN, request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return redirectTo(redirectUrl);
  }

  if (hasSession && isAuthRoute) {
    return redirectTo(new URL(PagesUrls.HOME, request.url));
  }

  // Términos: el callback ya lo verifica al iniciar sesión, pero este es el control
  // de fondo (sesiones previas, cambio de versión, link que no pasó por el callback).
  // Solo navegaciones GET de páginas: las server actions (POST) y /api no se redirigen.
  const isPageNavigation = request.method === 'GET' && !pathname.startsWith('/api/');

  if (
    hasSession &&
    isPageNavigation &&
    !matchesRoute(pathname, TERMS_EXEMPT_ROUTE_PATTERNS) &&
    !hasAcceptedCurrentTerms(claims?.user_metadata)
  ) {
    return redirectTo(new URL(PagesUrls.ACCEPT_TERMS, request.url));
  }

  return withSecurityHeaders(response, hasSession);
}

export const config = {
  matcher: [
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
};
