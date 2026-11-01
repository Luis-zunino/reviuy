import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { SupabaseProfileCommandRepository } from '../supabase-profile-command.repository';
import { CURRENT_TERMS_VERSION } from '@/constants/legal-terms.constant';

const mockCreateClient = vi.hoisted(() => vi.fn());
const mockDeleteUser = vi.hoisted(() => vi.fn());
const mockGetUserById = vi.hoisted(() => vi.fn());
const mockUpdateUserById = vi.hoisted(() => vi.fn());
const mockSupabaseAdmin = vi.hoisted(() => ({
  auth: {
    admin: {
      deleteUser: mockDeleteUser,
      getUserById: mockGetUserById,
      updateUserById: mockUpdateUserById,
    },
  },
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}));

vi.mock('@/lib/errors', () => ({
  createError: vi.fn((code, message) => {
    const err: any = new Error(message);
    err.code = code;
    return err;
  }),
}));

describe('SupabaseProfileCommandRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role-key');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
    mockCreateClient.mockReturnValue(mockSupabaseAdmin);
    mockDeleteUser.mockResolvedValue({ data: null, error: null });
    mockGetUserById.mockResolvedValue({
      data: { user: { id: 'user-1', app_metadata: { provider: 'magiclink' } } },
      error: null,
    });
    mockUpdateUserById.mockResolvedValue({ data: null, error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns success on valid input with proper env vars', async () => {
    const repo = new SupabaseProfileCommandRepository();
    const result = await repo.deleteAccount({
      userId: 'user-1',
      lastSignInAt: null,
    });

    expect(result).toEqual({ success: true });
    expect(mockCreateClient).toHaveBeenCalledWith('https://test.supabase.co', 'service-role-key', {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    expect(mockDeleteUser).toHaveBeenCalledWith('user-1');
  });

  it('throws INTERNAL_ERROR when SUPABASE_URL is missing', async () => {
    vi.stubEnv('SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    const repo = new SupabaseProfileCommandRepository();

    await expect(
      repo.deleteAccount({
        userId: 'user-1',
        lastSignInAt: null,
      })
    ).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
    });
    expect(mockDeleteUser).not.toHaveBeenCalled();
  });

  it('throws INTERNAL_ERROR when SUPABASE_SERVICE_ROLE_KEY is missing', async () => {
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');
    const repo = new SupabaseProfileCommandRepository();

    await expect(
      repo.deleteAccount({
        userId: 'user-1',
        lastSignInAt: null,
      })
    ).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
    });
    expect(mockDeleteUser).not.toHaveBeenCalled();
  });

  it('throws INVALID_INPUT when userId is empty string', async () => {
    const repo = new SupabaseProfileCommandRepository();

    await expect(
      repo.deleteAccount({
        userId: '',
        lastSignInAt: null,
      })
    ).rejects.toMatchObject({
      code: 'INVALID_INPUT',
    });
    expect(mockDeleteUser).not.toHaveBeenCalled();
  });

  it('throws INTERNAL_ERROR when admin.deleteUser returns an error', async () => {
    mockDeleteUser.mockResolvedValue({ data: null, error: new Error('Delete failed') });
    const repo = new SupabaseProfileCommandRepository();

    await expect(
      repo.deleteAccount({
        userId: 'user-1',
        lastSignInAt: null,
      })
    ).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
    });
  });

  it('falls back to NEXT_PUBLIC_SUPABASE_URL when SUPABASE_URL is not set', async () => {
    vi.unstubAllEnvs();
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role-key');
    mockCreateClient.mockReturnValue(mockSupabaseAdmin);
    mockDeleteUser.mockResolvedValue({ data: null, error: null });

    const repo = new SupabaseProfileCommandRepository();
    const result = await repo.deleteAccount({
      userId: 'user-1',
      lastSignInAt: null,
    });

    expect(result).toEqual({ success: true });
    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test-project.supabase.co',
      'service-role-key',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    expect(mockDeleteUser).toHaveBeenCalledWith('user-1');
  });

  describe('acceptTerms', () => {
    it('signs the acceptance in app_metadata preserving existing keys', async () => {
      const repo = new SupabaseProfileCommandRepository();
      const result = await repo.acceptTerms({ userId: 'user-1', version: 'v3' });

      expect(result).toEqual({ success: true });
      expect(mockGetUserById).toHaveBeenCalledWith('user-1');
      expect(mockUpdateUserById).toHaveBeenCalledWith('user-1', {
        app_metadata: {
          provider: 'magiclink',
          terms_accepted_at: expect.any(String),
          terms_version: 'v3',
        },
      });
    });

    it('records the current terms version when the use-case sends it', async () => {
      const repo = new SupabaseProfileCommandRepository();
      await repo.acceptTerms({ userId: 'user-1', version: CURRENT_TERMS_VERSION });

      const appMetadata = mockUpdateUserById.mock.calls[0][1].app_metadata;
      expect(appMetadata.terms_version).toBe(CURRENT_TERMS_VERSION);
    });

    it('throws INTERNAL_ERROR before signing when env configuration is missing', async () => {
      vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');
      const repo = new SupabaseProfileCommandRepository();

      await expect(
        repo.acceptTerms({ userId: 'user-1', version: CURRENT_TERMS_VERSION })
      ).rejects.toMatchObject({ code: 'INTERNAL_ERROR' });
      expect(mockUpdateUserById).not.toHaveBeenCalled();
    });

    it('throws INTERNAL_ERROR when admin.getUserById fails', async () => {
      mockGetUserById.mockResolvedValue({ data: { user: null }, error: new Error('No user') });
      const repo = new SupabaseProfileCommandRepository();

      await expect(
        repo.acceptTerms({ userId: 'user-1', version: CURRENT_TERMS_VERSION })
      ).rejects.toMatchObject({ code: 'INTERNAL_ERROR' });
      expect(mockUpdateUserById).not.toHaveBeenCalled();
    });

    it('throws INTERNAL_ERROR when admin.updateUserById fails', async () => {
      mockUpdateUserById.mockResolvedValue({ data: null, error: new Error('Update failed') });
      const repo = new SupabaseProfileCommandRepository();

      await expect(
        repo.acceptTerms({ userId: 'user-1', version: CURRENT_TERMS_VERSION })
      ).rejects.toMatchObject({ code: 'INTERNAL_ERROR' });
    });
  });
});
