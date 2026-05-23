import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const mockCreateSupabaseServerClient = vi.hoisted(() => vi.fn());

vi.mock('@/modules/profiles/application', () => ({
  createDeleteAccountUseCase: vi.fn(({ getCurrentUserId }) => {
    return async ({ lastSignInAt }: any) => {
      const userId = await getCurrentUserId();
      if (!userId) {
        const err: any = new Error('No autenticado');
        err.code = 'UNAUTHORIZED';
        throw err;
      }
      if (!lastSignInAt) {
        const err: any = new Error('Sesión no válida');
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
  RateLimitType: { SENSITIVE: 'sensitive' },
}));
vi.mock('@/lib/errors', () => ({
  createError: vi.fn((code, message) => { const err: any = new Error(message); err.code = code; return err; }),
}));

describe('deleteAccountAction', () => {
  it('returns the success result from the use case', async () => {
    mockCreateSupabaseServerClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1', last_sign_in_at: new Date().toISOString() } }, error: null }),
      },
    });

    const { deleteAccountAction } = await import('../delete-account.actions');

    const result = await deleteAccountAction();

    expect(result).toEqual({ success: true });
  });

  it('throws UNAUTHORIZED when no user returned from auth', async () => {
    mockCreateSupabaseServerClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('No user') }),
      },
    });

    const { deleteAccountAction } = await import('../delete-account.actions');

    await expect(deleteAccountAction()).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
  });
});
