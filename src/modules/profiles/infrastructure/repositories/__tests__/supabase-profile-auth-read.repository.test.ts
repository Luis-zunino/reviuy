import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SupabaseProfileAuthReadRepository } from '../supabase-profile-auth-read.repository';

vi.mock('@/utils/sessionMapped.util', () => ({
  sessionMapped: vi.fn(),
}));

import { sessionMapped } from '@/utils/sessionMapped.util';

describe('SupabaseProfileAuthReadRepository', () => {
  const mockGetUser = vi.fn();
  const mockGetSession = vi.fn();

  const mockSupabase = {
    auth: {
      getUser: mockGetUser,
      getSession: mockGetSession,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' }, expires_at: 123456 } },
      error: null,
    });
  });

  describe('verifyAuthentication', () => {
    it('returns userId and no error on authenticated user', async () => {
      const repo = new SupabaseProfileAuthReadRepository(mockSupabase);
      const result = await repo.verifyAuthentication();

      expect(result).toEqual({ userId: 'user-1', error: null });
      expect(mockGetUser).toHaveBeenCalledTimes(1);
    });

    it('returns null userId when no user', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
      const repo = new SupabaseProfileAuthReadRepository(mockSupabase);
      const result = await repo.verifyAuthentication();

      expect(result).toEqual({ userId: null, error: null });
    });

    it('propagates error from supabase', async () => {
      const testError = new Error('Auth error');
      mockGetUser.mockResolvedValue({ data: { user: null }, error: testError });
      const repo = new SupabaseProfileAuthReadRepository(mockSupabase);
      const result = await repo.verifyAuthentication();

      expect(result).toEqual({ userId: null, error: testError });
    });
  });

  describe('getSession', () => {
    it('returns mapped session when authenticated', async () => {
      (sessionMapped as any).mockReturnValue({ userId: 'user-1', expiresAt: 123456 });
      const repo = new SupabaseProfileAuthReadRepository(mockSupabase);
      const result = await repo.getSession();

      expect(result).toEqual({ session: { userId: 'user-1', expiresAt: 123456 }, error: null });
      expect(mockGetSession).toHaveBeenCalledTimes(1);
      expect(sessionMapped).toHaveBeenCalledWith({ user: { id: 'user-1' }, expires_at: 123456 });
    });

    it('returns null session when no session', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
      (sessionMapped as any).mockReturnValue(null);
      const repo = new SupabaseProfileAuthReadRepository(mockSupabase);
      const result = await repo.getSession();

      expect(result).toEqual({ session: null, error: null });
      expect(sessionMapped).toHaveBeenCalledWith(null);
    });

    it('propagates error', async () => {
      const testError = new Error('Session error');
      mockGetSession.mockResolvedValue({ data: { session: null }, error: testError });
      (sessionMapped as any).mockReturnValue(null);
      const repo = new SupabaseProfileAuthReadRepository(mockSupabase);
      const result = await repo.getSession();

      expect(result).toEqual({ session: null, error: testError });
    });
  });
});
