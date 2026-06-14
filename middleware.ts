import { PagesUrls } from '@/enums/pagesUrls.enum';
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

const base64urlDecode = (str: string): string => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return atob(padded);
};

type SupabaseSession = {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
  refresh_token: string;
  user?: Record<string, unknown> | null;
};

type RefreshResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
  refresh_token: string;
  user?: Record<string, unknown> | null;
};

const getSessionFromCookie = (
  request: NextRequest
): { access_token: string; refresh_token?: string } | null => {
  const authCookie = request.cookies
    .getAll()
    .find((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));

  if (!authCookie?.value) return null;

  try {
    const decoded = base64urlDecode(authCookie.value);
    const parsed = JSON.parse(decoded) as SupabaseSession;
    return { access_token: parsed.access_token, refresh_token: parsed.refresh_token };
  } catch {
    return null;
  }
};

const setSessionCookie = (response: NextResponse, session: RefreshResponse, cookieName: string) => {
  const sessionToStore: SupabaseSession = {
    access_token: session.access_token,
    token_type: session.token_type,
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    refresh_token: session.refresh_token,
    user: session.user ?? null,
  };

  const encoded = btoa(JSON.stringify(sessionToStore));
  response.cookies.set(cookieName, encoded, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
};

const fetchUser = async (
  accessToken: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<{ id: string } | null> => {
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) return null;

    const body = await res.json();
    return body?.id ? { id: body.id } : null;
  } catch {
    return null;
  }
};

const refreshSession = async (
  refreshToken: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<RefreshResponse | null> => {
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return null;

    return (await res.json()) as RefreshResponse;
  } catch {
    return null;
  }
};

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const isProtected = matchesRoute(pathname, PROTECTED_ROUTE_PATTERNS);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (isProtected) {
      const redirectUrl = new URL(PagesUrls.LOGIN, request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return withSecurityHeaders(NextResponse.redirect(redirectUrl));
    }
    return withSecurityHeaders(supabaseResponse);
  }

  let user: { id: string } | null = null;
  const session = getSessionFromCookie(request);

  if (session?.access_token) {
    user = await fetchUser(session.access_token, supabaseUrl, supabaseKey);
  }

  if (!user && session?.refresh_token) {
    const refreshed = await refreshSession(session.refresh_token, supabaseUrl, supabaseKey);

    if (refreshed) {
      supabaseResponse = NextResponse.next();
      user = await fetchUser(refreshed.access_token, supabaseUrl, supabaseKey);

      if (user) {
        const cookieName = request.cookies
          .getAll()
          .find((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))?.name;

        if (cookieName) {
          setSessionCookie(supabaseResponse, refreshed, cookieName);
        }
      }
    }
  }

  if (isProtected && !user) {
    const redirectUrl = new URL(PagesUrls.LOGIN, request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
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
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
};
