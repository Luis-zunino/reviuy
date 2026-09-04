import { PagesUrls } from '@/enums/pagesUrls.enum';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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
  const isDev = process.env.NODE_ENV === 'development';
  const localSupabase = isDev ? 'http://127.0.0.1:54321' : '';
  return `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://apis.google.com https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://placehold.co https://firebasestorage.googleapis.com https://lh3.googleusercontent.com https://*.tile.openstreetmap.org;
    font-src 'self' data:;
    connect-src 'self' ${localSupabase} https://*.supabase.co https://firebasestorage.googleapis.com https://vitals.vercel-insights.com https://nominatim.openstreetmap.org;
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
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
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
  const isAuthRoute = matchesRoute(pathname, AUTH_ROUTE_PATTERNS);

  if (isProtected && !user) {
    const redirectUrl = new URL(PagesUrls.LOGIN, request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return withSecurityHeaders(NextResponse.redirect(redirectUrl));
  }

  if (user && isAuthRoute) {
    return withSecurityHeaders(NextResponse.redirect(new URL(PagesUrls.HOME, request.url)));
  }

  return withSecurityHeaders(response);
}

export const config = {
  matcher: [
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
};