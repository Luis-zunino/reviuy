// @vitest-environment jsdom
import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLogin } from '../useLogin.hook';

const { signInWithEmailServerMock, signInWithGoogleServerMock, toastErrorMock, toastSuccessMock } =
  vi.hoisted(() => ({
    signInWithEmailServerMock: vi.fn(),
    signInWithGoogleServerMock: vi.fn(),
    toastErrorMock: vi.fn(),
    toastSuccessMock: vi.fn(),
  }));

vi.mock('@/shared/auth/auth-server-actions', () => ({
  signInWithEmailServer: signInWithEmailServerMock,
  signInWithGoogleServer: signInWithGoogleServerMock,
}));

vi.mock('sonner', () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

const renderMountedHook = async () => {
  const { result } = renderHook(() => useLogin());
  await waitFor(() => expect(result.current).not.toBeNull());
  return { result };
};

const submitEmail = async (email: string) => {
  const { result } = await renderMountedHook();
  await act(async () => {
    await result.current.onSubmit({ email });
  });
  return { result };
};

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(globalThis, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  describe('Google sign-in', () => {
    it('calls signInWithGoogleServer when invoked', async () => {
      signInWithGoogleServerMock.mockResolvedValue({ url: 'https://accounts.google.com/auth' });

      const { result } = await renderMountedHook();

      await act(async () => {
        await result.current.onGoogleSignIn();
      });

      expect(signInWithGoogleServerMock).toHaveBeenCalledTimes(1);
    });

    it('redirects to the google URL via location.href', async () => {
      const googleUrl = 'https://accounts.google.com/o/oauth2/auth?client_id=xxx';
      signInWithGoogleServerMock.mockResolvedValue({ url: googleUrl });

      const { result } = await renderMountedHook();

      await act(async () => {
        await result.current.onGoogleSignIn();
      });

      expect(globalThis.location.href).toBe(googleUrl);
    });

    it('shows error toast when signInWithGoogleServer rejects with an Error', async () => {
      signInWithGoogleServerMock.mockRejectedValue(new Error('Google auth failed'));

      const { result } = await renderMountedHook();

      await act(async () => {
        await result.current.onGoogleSignIn();
      });

      expect(toastErrorMock).toHaveBeenCalledWith(
        'Error al iniciar sesión',
        expect.objectContaining({ description: 'Google auth failed', duration: 4000 })
      );
    });

    it('shows generic error toast when rejection is not an Error', async () => {
      signInWithGoogleServerMock.mockRejectedValue('plain string rejection');

      const { result } = await renderMountedHook();

      await act(async () => {
        await result.current.onGoogleSignIn();
      });

      expect(toastErrorMock).toHaveBeenCalledWith(
        'Error al iniciar sesión',
        expect.objectContaining({
          description: 'Hubo un problema al iniciar sesión con Google. Inténtalo de nuevo.',
        })
      );
    });
  });

  describe('Email magic link', () => {
    it('calls signInWithEmailServer with the provided email', async () => {
      signInWithEmailServerMock.mockResolvedValue({ success: true });

      await submitEmail('user@test.com');

      expect(signInWithEmailServerMock).toHaveBeenCalledWith('user@test.com');
    });

    it('shows success toast after successful sign-in', async () => {
      signInWithEmailServerMock.mockResolvedValue({ success: true });

      await submitEmail('user@test.com');

      expect(toastSuccessMock).toHaveBeenCalledWith(
        '¡Revisá tu correo!',
        expect.objectContaining({ duration: 5000 })
      );
    });

    it('shows generic error toast when sign-in fails with an Error', async () => {
      signInWithEmailServerMock.mockRejectedValue(new Error('Service unavailable'));

      await submitEmail('user@test.com');

      expect(toastErrorMock).toHaveBeenCalledWith(
        'Error al enviar el enlace',
        expect.objectContaining({ description: 'Service unavailable', duration: 5000 })
      );
    });

    it('shows rate-limit toast when error has status 429', async () => {
      const rateLimitError = new Error('Too many requests') as Error & { status?: number };
      rateLimitError.status = 429;
      signInWithEmailServerMock.mockRejectedValue(rateLimitError);

      await submitEmail('user@test.com');

      expect(toastErrorMock).toHaveBeenCalledWith(
        'Error al enviar el enlace',
        expect.objectContaining({
          description:
            'Esperá un par de minutos antes de pedir otro enlace. Revisá también tu carpeta de spam.',
        })
      );
    });

    it('shows rate-limit toast when error message matches rate limit pattern', async () => {
      signInWithEmailServerMock.mockRejectedValue(new Error('rate limit exceeded'));

      await submitEmail('user@test.com');

      expect(toastErrorMock).toHaveBeenCalledWith(
        'Error al enviar el enlace',
        expect.objectContaining({
          description:
            'Esperá un par de minutos antes de pedir otro enlace. Revisá también tu carpeta de spam.',
        })
      );
    });

    it('shows generic fallback toast when rejection is not an Error', async () => {
      signInWithEmailServerMock.mockRejectedValue('string rejection');

      await submitEmail('user@test.com');

      expect(toastErrorMock).toHaveBeenCalledWith(
        'Error al enviar el enlace',
        expect.objectContaining({
          description: 'Hubo un problema al enviar el enlace de acceso. Intentalo de nuevo.',
        })
      );
    });

    it('exposes register, handleSubmit and initial loading state', async () => {
      const { result } = await renderMountedHook();

      expect(result.current.loading).toBe(false);
      expect(result.current.onSubmit).toBeDefined();
      expect(result.current.onGoogleSignIn).toBeDefined();
      expect(result.current.register).toBeDefined();
      expect(result.current.handleSubmit).toBeDefined();
    });
  });
});
