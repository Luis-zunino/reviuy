import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { SupabaseProfileCommandRepository } from '../supabase-profile-command.repository';

const mockCreateClient = vi.hoisted(() => vi.fn());
const mockDeleteUser = vi.hoisted(() => vi.fn());
const mockSupabaseAdmin = vi.hoisted(() => ({
  auth: { admin: { deleteUser: mockDeleteUser } },
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
});
