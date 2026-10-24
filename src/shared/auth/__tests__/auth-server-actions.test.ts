import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockSignInWithOtp = vi.fn();
const mockSignInWithOAuth = vi.fn();
const mockSignOut = vi.fn();

const mockSupabase = {
  auth: {
    signInWithOtp: mockSignInWithOtp,
    signInWithOAuth: mockSignInWithOAuth,
    signOut: mockSignOut,
  },
};

const mockCreateSupabaseServerClient = vi.fn().mockResolvedValue(mockSupabase);
const mockWithRateLimit = vi.fn().mockResolvedValue(true);
const mockHeaderGet = vi.fn();

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({ get: mockHeaderGet })),
}));

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: mockCreateSupabaseServerClient,
}));

vi.mock('@/lib/redis', () => ({
  withRateLimit: mockWithRateLimit,
}));

describe('signInWithEmailServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeaderGet.mockImplementation((name: string) => (name === 'host' ? 'localhost:3000' : null));
  });

  it('calls withRateLimit with lowercased email key and auth_email scope', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });

    const { signInWithEmailServer } = await import('../auth-server-actions');

    await signInWithEmailServer('Test@Example.COM');

    expect(mockWithRateLimit).toHaveBeenCalledWith('auth:email:test@example.com', 'auth_email');
  });

  it('lowercases the email before sending to Supabase', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });

    const { signInWithEmailServer } = await import('../auth-server-actions');

    await signInWithEmailServer('TEST@EXAMPLE.COM');

    expect(mockSignInWithOtp).toHaveBeenCalledWith({
      email: 'test@example.com',
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/callback',
      },
    });
  });

  it('returns { success: true } on success', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });

    const { signInWithEmailServer } = await import('../auth-server-actions');

    const result = await signInWithEmailServer('user@test.com');

    expect(result).toEqual({ success: true });
  });

  it('throws error when Supabase returns an error', async () => {
    const supabaseError = new Error('Email rate limit exceeded');
    mockSignInWithOtp.mockResolvedValue({ error: supabaseError });

    const { signInWithEmailServer } = await import('../auth-server-actions');

    await expect(signInWithEmailServer('user@test.com')).rejects.toThrow(
      'Email rate limit exceeded'
    );
  });

  it('calls createSupabaseServerClient', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });

    const { signInWithEmailServer } = await import('../auth-server-actions');

    await signInWithEmailServer('user@test.com');

    expect(mockCreateSupabaseServerClient).toHaveBeenCalledTimes(1);
  });
});

describe('signInWithGoogleServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls withRateLimit with per-IP key and auth_oauth scope', async () => {
    mockHeaderGet.mockImplementation((name: string) => {
      if (name === 'x-forwarded-for') return '203.0.113.5, 10.0.0.1';
      if (name === 'host') return 'localhost:3000';
      return null;
    });
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: 'https://accounts.google.com/o/oauth2/auth' },
      error: null,
    });

    const { signInWithGoogleServer } = await import('../auth-server-actions');

    await signInWithGoogleServer();

    expect(mockWithRateLimit).toHaveBeenCalledWith('auth:google:203.0.113.5', 'auth_oauth');
  });

  it('calls signInWithOAuth with google provider and correct redirectTo', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: 'https://accounts.google.com/o/oauth2/auth' },
      error: null,
    });

    const { signInWithGoogleServer } = await import('../auth-server-actions');

    await signInWithGoogleServer();

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
      },
    });
  });

  it('returns { url } when Supabase returns a URL', async () => {
    const expectedUrl = 'https://accounts.google.com/o/oauth2/auth?client_id=xxx';
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: expectedUrl },
      error: null,
    });

    const { signInWithGoogleServer } = await import('../auth-server-actions');

    const result = await signInWithGoogleServer();

    expect(result).toEqual({ url: expectedUrl });
  });

  it('throws when data.url is null', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: null,
    });

    const { signInWithGoogleServer } = await import('../auth-server-actions');

    await expect(signInWithGoogleServer()).rejects.toThrow(
      'No se pudo obtener la URL de autenticación de Google'
    );
  });

  it('throws when Supabase returns an error', async () => {
    const supabaseError = new Error('OAuth provider error');
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: supabaseError,
    });

    const { signInWithGoogleServer } = await import('../auth-server-actions');

    await expect(signInWithGoogleServer()).rejects.toThrow('OAuth provider error');
  });
});
