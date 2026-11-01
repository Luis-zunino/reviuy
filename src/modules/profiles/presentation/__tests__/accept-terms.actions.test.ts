import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const mockCreateSupabaseServerClient = vi.hoisted(() => vi.fn());

vi.mock('@/modules/profiles/application', () => ({
  createAcceptTermsUseCase: vi.fn(({ getCurrentUserId }) => {
    return async () => {
      const userId = await getCurrentUserId();
      if (!userId) {
        const err: any = new Error('No autenticado');
        err.code = 'UNAUTHORIZED';
        throw err;
      }
      return { success: true };
    };
  }),
}));
vi.mock('@/modules/profiles/infrastructure', () => ({
  SupabaseProfileCommandRepository: vi.fn(),
}));
vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: mockCreateSupabaseServerClient,
}));
vi.mock('@/lib/redis', () => ({
  withRateLimit: vi.fn(),
  RateLimitType: { WRITE: 'write' },
}));

describe('acceptTermsAction', () => {
  it('returns the success result from the use case', async () => {
    mockCreateSupabaseServerClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1' } },
          error: null,
        }),
      },
    });

    const { acceptTermsAction } = await import('../accept-terms.actions');

    await expect(acceptTermsAction()).resolves.toEqual({ success: true });
  });

  it('throws UNAUTHORIZED when no user returned from auth', async () => {
    mockCreateSupabaseServerClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('No user') }),
      },
    });

    const { acceptTermsAction } = await import('../accept-terms.actions');

    await expect(acceptTermsAction()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });
});
