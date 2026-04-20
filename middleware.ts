import { PagesUrls } from '@/enums';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

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

const matchesRoute = (pathname: string, patterns: RegExp[]) => {
  return patterns.some((pattern) => pattern.test(pathname));
};

const buildCsp = () => {
  return `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://apis.google.com https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://placehold.co https://firebasestorage.googleapis.com https://lh3.googleusercontent.com https://*.tile.openstreetmap.org;
    font-src 'self' data:;
    connect-src 'self' https://*.supabase.co https://firebasestorage.googleapis.com https://vitals.vercel-insights.com https://nominatim.openstreetmap.org;
    object-src 'none';
    base-uri 'self';
    frame-ancestors 'none';
  `
    .replaceAll(/\s{2,}/g, ' ')
    .trim();
};

const withSecurityHeaders = (response: NextResponse) => {
  response.headers.set('Content-Security-Policy', buildCsp());
  response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  return response;
};

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next();
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  const isProtected = matchesRoute(pathname, PROTECTED_ROUTE_PATTERNS);

  if (isProtected && !user) {
    const redirectUrl = new URL(PagesUrls.LOGIN, request.url);
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return withSecurityHeaders(NextResponse.redirect(redirectUrl));
  }

  if (user && matchesRoute(pathname, AUTH_ROUTE_PATTERNS)) {
    return withSecurityHeaders(NextResponse.redirect(new URL(PagesUrls.HOME, request.url)));
  }

  return withSecurityHeaders(supabaseResponse);
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de request excepto aquellas que empiecen con:
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo favicon)
     * Siéntete libre de modificar este patrón para incluir más rutas.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
