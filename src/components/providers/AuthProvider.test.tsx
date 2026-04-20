import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from './AuthProvider';
import { useAuthContext } from './hooks';

const {
  signInWithOAuthMock,
  signInWithOtpMock,
  signOutMock,
  onAuthStateChangeMock,
  unsubscribeMock,
  pushMock,
  getSessionHandlerMock,
  sessionMappedMock,
} = vi.hoisted(() => ({
  signInWithOAuthMock: vi.fn(),
  signInWithOtpMock: vi.fn(),
  signOutMock: vi.fn(),
  onAuthStateChangeMock: vi.fn(),
  unsubscribeMock: vi.fn(),
  pushMock: vi.fn(),
  getSessionHandlerMock: vi.fn(),
  sessionMappedMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/lib/site-url', () => ({
  buildSiteUrl: () => 'https://reviuy.vercel.app/auth/callback',
}));

vi.mock('@/utils', () => ({
  sessionMapped: sessionMappedMock,
}));

vi.mock('@/lib/supabase', () => ({
  supabaseClient: {
    auth: {
      signInWithOAuth: signInWithOAuthMock,
      signInWithOtp: signInWithOtpMock,
      signOut: signOutMock,
      onAuthStateChange: onAuthStateChangeMock,
    },
  },
}));

vi.mock('@/modules/profiles/infrastructure', () => ({
  SupabaseProfileAuthReadRepository: vi.fn(),
}));

vi.mock('@/modules/profiles/application', () => ({
  createGetSessionQuery: () => getSessionHandlerMock,
}));

const AuthConsumer = () => {
  const { loading, isAuthenticated, signInWithGoogle, signInWithEmail, signOut } = useAuthContext();

  return (
    <div>
      <span>loading:{String(loading)}</span>
      <span>auth:{String(isAuthenticated)}</span>
      <button
        type="button"
        onClick={() =>
          signInWithGoogle({
            acceptedTerms: true,
            termsAcceptedAt: '2026-04-11T12:00:00.000Z',
            termsVersion: 'v2',
          })
        }
      >
        GoogleSignIn
      </button>
      <button
        type="button"
        onClick={() =>
          signInWithEmail('test@reviuy.com', {
            acceptedTerms: true,
            termsAcceptedAt: '2026-04-11T13:00:00.000Z',
            termsVersion: 'v3',
          })
        }
      >
        EmailSignIn
      </button>
      <button type="button" onClick={() => signOut()}>
        SignOut
      </button>
    </div>
  );
};

const renderProvider = (children: ReactNode = <AuthConsumer />) => {
  return render(<AuthProvider>{children}</AuthProvider>);
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getSessionHandlerMock.mockResolvedValue({
      session: {
        userId: 'user-initial',
        expiresAt: 123,
      },
    });

    signInWithOAuthMock.mockResolvedValue({ error: null });
    signInWithOtpMock.mockResolvedValue({ error: null });
    signOutMock.mockResolvedValue({ error: null });
    sessionMappedMock.mockImplementation((session) => {
      if (!session) return null;
      return { userId: session.user?.id ?? '', expiresAt: session.expires_at ?? 0 };
    });

    onAuthStateChangeMock.mockImplementation((cb) => {
      (onAuthStateChangeMock as unknown as { __cb?: typeof cb }).__cb = cb;
      return {
        data: {
          subscription: {
            unsubscribe: unsubscribeMock,
          },
        },
      };
    });
  });

  it('obtiene sesión inicial y actualiza autenticación', async () => {
    renderProvider();

    await waitFor(() => {
      expect(screen.getByText('loading:false')).toBeInTheDocument();
    });

    expect(getSessionHandlerMock).toHaveBeenCalledWith({});
    expect(screen.getByText('auth:true')).toBeInTheDocument();
  });

  it('signInWithGoogle usa redirectTo con términos aceptados', async () => {
    const user = userEvent.setup();
    renderProvider();

    await user.click(screen.getByRole('button', { name: 'GoogleSignIn' }));

    expect(signInWithOAuthMock).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo:
          'https://reviuy.vercel.app/auth/callback?terms_accepted=1&terms_accepted_at=2026-04-11T12%3A00%3A00.000Z&terms_version=v2',
      },
    });
  });

  it('signInWithEmail usa emailRedirectTo con términos aceptados', async () => {
    const user = userEvent.setup();
    renderProvider();

    await user.click(screen.getByRole('button', { name: 'EmailSignIn' }));

    expect(signInWithOtpMock).toHaveBeenCalledWith({
      email: 'test@reviuy.com',
      options: {
        emailRedirectTo:
          'https://reviuy.vercel.app/auth/callback?terms_accepted=1&terms_accepted_at=2026-04-11T13%3A00%3A00.000Z&terms_version=v3',
      },
    });
  });

  it('signOut llama a supabase y redirige a HOME', async () => {
    const user = userEvent.setup();
    renderProvider();

    await user.click(screen.getByRole('button', { name: 'SignOut' }));

    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/home');
  });

  it('actualiza sesión con onAuthStateChange', async () => {
    renderProvider();

    const callback = (
      onAuthStateChangeMock as unknown as { __cb?: (event: string, session: unknown) => void }
    ).__cb;
    expect(callback).toBeDefined();

    await act(async () => {
      callback?.('SIGNED_IN', {
        user: { id: 'user-evt' },
        expires_at: 999,
      });
    });

    await waitFor(() => {
      expect(sessionMappedMock).toHaveBeenCalled();
      expect(screen.getByText('auth:true')).toBeInTheDocument();
    });
  });
});
