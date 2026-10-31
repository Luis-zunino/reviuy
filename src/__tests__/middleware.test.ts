import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { CURRENT_TERMS_VERSION } from '@/constants/legal-terms.constant';

type CookieMethods = {
  getAll: () => { name: string; value: string }[];
  setAll: (
    cookies: { name: string; value: string; options?: Record<string, unknown> }[],
    headers?: Record<string, string>
  ) => void;
};

const { getClaimsMock, createServerClientMock } = vi.hoisted(() => ({
  getClaimsMock: vi.fn(),
  createServerClientMock: vi.fn(),
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: createServerClientMock,
}));

const ACCEPTED = { sub: 'user-1', user_metadata: { terms_version: CURRENT_TERMS_VERSION } };

/** Configura la sesión simulada y, opcionalmente, un refresh de token durante getClaims. */
const mockSession = (
  claims: Record<string, unknown> | null,
  refreshedCookies?: { name: string; value: string }[]
) => {
  createServerClientMock.mockImplementation(
    (_url: string, _key: string, { cookies }: { cookies: CookieMethods }) => ({
      auth: {
        getClaims: getClaimsMock.mockImplementation(async () => {
          if (refreshedCookies) {
            cookies.setAll(refreshedCookies, { 'Cache-Control': 'private, no-cache, no-store' });
          }
          return { data: claims ? { claims } : null, error: null };
        }),
      },
    })
  );
};

const run = async (path: string, init?: { method?: string }) => {
  const { middleware } = await import('../../middleware');
  return middleware(new NextRequest(`http://localhost:3000${path}`, init));
};

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses getClaims to read the session', async () => {
    mockSession(null);

    await run('/home');

    expect(getClaimsMock).toHaveBeenCalledTimes(1);
  });

  it('redirects anonymous users from protected routes to login with redirectTo', async () => {
    mockSession(null);

    const response = await run('/review/create');

    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/login?redirectTo=%2Freview%2Fcreate'
    );
  });

  it('redirects logged-in users away from the login page', async () => {
    mockSession(ACCEPTED);

    const response = await run('/login');

    expect(response.headers.get('location')).toBe('http://localhost:3000/home');
  });

  it('lets a user with the current terms through', async () => {
    mockSession(ACCEPTED);

    const response = await run('/home');

    expect(response.headers.get('location')).toBeNull();
  });

  it.each([
    ['without terms', { sub: 'user-1', user_metadata: {} }],
    ['with an outdated version', { sub: 'user-1', user_metadata: { terms_version: 'v0' } }],
  ])('redirects a logged-in user %s to accept the terms', async (_label, claims) => {
    mockSession(claims);

    const response = await run('/home');

    expect(response.headers.get('location')).toBe('http://localhost:3000/auth/accept-terms');
  });

  it.each(['/auth/accept-terms', '/auth/callback', '/terminos', '/privacidad'])(
    'does not enforce terms on %s',
    async (path) => {
      mockSession({ sub: 'user-1', user_metadata: {} });

      const response = await run(path);

      expect(response.headers.get('location')).toBeNull();
    }
  );

  it('does not redirect POST requests (server actions) or API routes for terms', async () => {
    mockSession({ sub: 'user-1', user_metadata: {} });

    const post = await run('/home', { method: 'POST' });
    const api = await run('/api/report-review');

    expect(post.headers.get('location')).toBeNull();
    expect(api.headers.get('location')).toBeNull();
  });

  it('marks responses with a session as private and anonymous ones as public', async () => {
    mockSession(ACCEPTED);
    const withSession = await run('/home');

    mockSession(null);
    const anonymous = await run('/home');

    expect(withSession.headers.get('cache-control')).toBe('private, no-store');
    expect(anonymous.headers.get('cache-control')).toBe('public, max-age=0, must-revalidate');
  });

  it('propagates refreshed session cookies to the response', async () => {
    mockSession(ACCEPTED, [{ name: 'sb-access-token', value: 'new-token' }]);

    const response = await run('/home');

    expect(response.cookies.get('sb-access-token')?.value).toBe('new-token');
  });

  it('keeps refreshed session cookies on redirects', async () => {
    mockSession({ sub: 'user-1', user_metadata: {} }, [
      { name: 'sb-access-token', value: 'new-token' },
    ]);

    const response = await run('/home');

    expect(response.headers.get('location')).toBe('http://localhost:3000/auth/accept-terms');
    expect(response.cookies.get('sb-access-token')?.value).toBe('new-token');
  });
});
