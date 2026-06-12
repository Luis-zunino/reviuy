// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Login } from '../index';

const { signInWithGoogleMock, signInWithEmailMock } = vi.hoisted(() => ({
  signInWithGoogleMock: vi.fn(),
  signInWithEmailMock: vi.fn(),
}));

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mock-inter-class' }),
}));

vi.mock('@/components/providers/AuthProvider', () => ({
  useAuthContext: () => ({
    signInWithGoogle: signInWithGoogleMock,
    signInWithEmail: signInWithEmailMock,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('Login flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('calls signInWithGoogle without payload when Google button is clicked', async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByRole('button', { name: /continuar con google/i }));

    expect(signInWithGoogleMock).toHaveBeenCalledTimes(1);
    expect(signInWithGoogleMock).toHaveBeenCalledWith();
  });

  it('sends email to signInWithEmail and shows success toast', async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /enviar enlace mágico/i }));

    await waitFor(() => {
      expect(signInWithEmailMock).toHaveBeenCalledTimes(1);
    });

    expect(signInWithEmailMock).toHaveBeenCalledWith('test@example.com');
  });

  it('shows error toast when email sign-in fails', async () => {
    const toastError = vi.mocked((await import('sonner')).toast.error);
    signInWithEmailMock.mockRejectedValueOnce(new Error('Network error'));

    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /enviar enlace mágico/i }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Error al enviar el enlace', expect.any(Object));
    });
  });
});
