import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { CURRENT_TERMS_VERSION } from '@/constants/legal-terms.constant';

const mockExchangeCodeForSession = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: vi.fn().mockResolvedValue({
    auth: { exchangeCodeForSession: mockExchangeCodeForSession },
  }),
}));

const callbackRequest = (query = '') =>
  new NextRequest(`http://localhost:3000/auth/callback${query}`);

describe('GET /auth/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login with an error when there is no code', async () => {
    const { GET } = await import('../route');

    const response = await GET(callbackRequest('?error=access_denied'));

    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/login?error=auth_callback'
    );
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
  });

  it('redirects to login with an error when the code exchange fails', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: null },
      error: { message: 'invalid flow state' },
    });
    const { GET } = await import('../route');

    const response = await GET(callbackRequest('?code=expired'));

    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/login?error=auth_callback'
    );
  });

  it('redirects to home when the user accepted the current terms', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: { user_metadata: { terms_version: CURRENT_TERMS_VERSION } } },
      error: null,
    });
    const { GET } = await import('../route');

    const response = await GET(callbackRequest('?code=valid'));

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('valid');
    expect(response.headers.get('location')).toBe('http://localhost:3000/home');
  });

  it.each([
    ['a first-time user', {}],
    ['a user with an outdated terms version', { terms_version: 'v0' }],
  ])('redirects %s to accept the terms', async (_label, metadata) => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: { user_metadata: metadata } },
      error: null,
    });
    const { GET } = await import('../route');

    const response = await GET(callbackRequest('?code=valid'));

    expect(response.headers.get('location')).toBe('http://localhost:3000/auth/accept-terms');
  });
});
