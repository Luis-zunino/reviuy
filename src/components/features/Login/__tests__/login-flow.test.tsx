// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Login } from '../index';

const { signInWithGoogleServerMock, signInWithEmailServerMock } = vi.hoisted(() => ({
  signInWithGoogleServerMock: vi.fn(),
  signInWithEmailServerMock: vi.fn(),
}));

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mock-inter-class' }),
}));

vi.mock('@/shared/auth/auth-server-actions', () => ({
  signInWithGoogleServer: signInWithGoogleServerMock,
  signInWithEmailServer: signInWithEmailServerMock,
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
  });

  it('calls signInWithGoogleServer and redirects on Google button click', async () => {
    signInWithGoogleServerMock.mockResolvedValue({ url: 'https://google.com/auth' });
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByRole('button', { name: /continuar con google/i }));

    await waitFor(() => {
      expect(signInWithGoogleServerMock).toHaveBeenCalledTimes(1);
    });
  });

  it('calls signInWithEmailServer and shows success toast', async () => {
    signInWithEmailServerMock.mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /enviar enlace mágico/i }));

    await waitFor(() => {
      expect(signInWithEmailServerMock).toHaveBeenCalledTimes(1);
    });

    expect(signInWithEmailServerMock).toHaveBeenCalledWith('test@example.com');

    const toastSuccess = vi.mocked((await import('sonner')).toast.success);
    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('¡Revisá tu correo!', expect.any(Object));
    });
  });

  it('shows error toast when email sign-in fails', async () => {
    const toastError = vi.mocked((await import('sonner')).toast.error);
    signInWithEmailServerMock.mockRejectedValueOnce(new Error('Network error'));

    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /enviar enlace mágico/i }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Error al enviar el enlace', expect.any(Object));
    });
  });
});