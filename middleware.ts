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

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const pathname = request.nextUrl.pathname;

  const isProtected = matchesRoute(pathname, PROTECTED_ROUTE_PATTERNS);

  if (isProtected && !session) {
    const redirectUrl = new URL(PagesUrls.LOGIN, request.url);
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && matchesRoute(pathname, AUTH_ROUTE_PATTERNS)) {
    return NextResponse.redirect(new URL(PagesUrls.HOME, request.url));
  }

  return supabaseResponse;
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
