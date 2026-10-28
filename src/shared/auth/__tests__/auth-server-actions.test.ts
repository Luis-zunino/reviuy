import { describe, expect, it, vi, beforeEach } from 'vitest';
import { buildSiteUrl } from '@/lib/site-url';

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

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: mockCreateSupabaseServerClient,
}));

vi.mock('@/lib/redis', () => ({
  withRateLimit: mockWithRateLimit,
}));

const mockHeaders = vi.fn();

vi.mock('next/headers', () => ({
  headers: mockHeaders,
}));

describe('signInWithEmailServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls withRateLimit with lowercased email key and auth_email scope', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });

    const { signInWithEmailServer } = await import('../auth-server-actions');

    await signInWithEmailServer('Test@Example.COM');

    expect(mockWithRateLimit).toHaveBeenCalledWith('auth:email:test@example.com', 'auth_email');
  });

  it('rejects an invalid email before rate limiting or calling Supabase', async () => {
    const { signInWithEmailServer } = await import('../auth-server-actions');

    await expect(signInWithEmailServer('no-es-un-email')).rejects.toMatchObject({
      code: 'INVALID_INPUT',
    });
    expect(mockWithRateLimit).not.toHaveBeenCalled();
    expect(mockSignInWithOtp).not.toHaveBeenCalled();
  });

  it('lowercases the email before sending to Supabase', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });

    const { signInWithEmailServer } = await import('../auth-server-actions');

    await signInWithEmailServer('TEST@EXAMPLE.COM');

    expect(mockSignInWithOtp).toHaveBeenCalledWith({
      email: 'test@example.com',
      options: {
        emailRedirectTo: buildSiteUrl('/auth/callback'),
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
    mockHeaders.mockResolvedValue(new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }));
  });

  it('calls withRateLimit with a per-IP auth:google key and auth_oauth scope', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: 'https://accounts.google.com/o/oauth2/auth' },
      error: null,
    });

    const { signInWithGoogleServer } = await import('../auth-server-actions');

    await signInWithGoogleServer();

    // Clave por IP del cliente (primer valor de x-forwarded-for), no global
    expect(mockWithRateLimit).toHaveBeenCalledWith('auth:google:203.0.113.7', 'auth_oauth');
  });

  it('prefers the non-spoofable x-vercel-forwarded-for header', async () => {
    mockHeaders.mockResolvedValue(
      new Headers({ 'x-vercel-forwarded-for': '192.0.2.10', 'x-forwarded-for': '203.0.113.99' })
    );
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: 'https://accounts.google.com/o/oauth2/auth' },
      error: null,
    });

    const { signInWithGoogleServer } = await import('../auth-server-actions');

    await signInWithGoogleServer();

    expect(mockWithRateLimit).toHaveBeenCalledWith('auth:google:192.0.2.10', 'auth_oauth');
  });

  it('falls back to x-real-ip when x-forwarded-for is missing', async () => {
    mockHeaders.mockResolvedValue(new Headers({ 'x-real-ip': '198.51.100.4' }));
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: 'https://accounts.google.com/o/oauth2/auth' },
      error: null,
    });

    const { signInWithGoogleServer } = await import('../auth-server-actions');

    await signInWithGoogleServer();

    expect(mockWithRateLimit).toHaveBeenCalledWith('auth:google:198.51.100.4', 'auth_oauth');
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
        redirectTo: buildSiteUrl('/auth/callback'),
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

describe('signOutServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls supabase.auth.signOut', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const { signOutServer } = await import('../auth-server-actions');

    await signOutServer();

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('returns { success: true } on success', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const { signOutServer } = await import('../auth-server-actions');

    const result = await signOutServer();

    expect(result).toEqual({ success: true });
  });

  it('throws when Supabase returns an error', async () => {
    const supabaseError = new Error('Session not found');
    mockSignOut.mockResolvedValue({ error: supabaseError });

    const { signOutServer } = await import('../auth-server-actions');

    await expect(signOutServer()).rejects.toThrow('Session not found');
  });
});

describe('auth callback URL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeaders.mockResolvedValue(new Headers());
  });

  // GoTrue descarta un redirect_to relativo y manda el link a la raíz del sitio,
  // salteando /auth/callback (y la verificación de términos).
  it('sends an absolute callback URL for both email and Google sign-in', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: 'https://accounts.google.com/o/oauth2/auth' },
      error: null,
    });

    const { signInWithEmailServer, signInWithGoogleServer } =
      await import('../auth-server-actions');
    await signInWithEmailServer('user@example.com');
    await signInWithGoogleServer();

    const emailRedirect = mockSignInWithOtp.mock.calls[0][0].options.emailRedirectTo;
    const oauthRedirect = mockSignInWithOAuth.mock.calls[0][0].options.redirectTo;

    for (const url of [emailRedirect, oauthRedirect]) {
      expect(url).toMatch(/^https?:\/\//);
      expect(new URL(url).pathname).toBe('/auth/callback');
    }
  });
});
