import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Login } from './index';

const { signInWithGoogleMock, signInWithEmailMock } = vi.hoisted(() => ({
  signInWithGoogleMock: vi.fn(),
  signInWithEmailMock: vi.fn(),
}));

vi.mock('next/font/google', () => ({
  Manrope: () => ({ className: 'manrope' }),
  Playfair_Display: () => ({ className: 'playfair' }),
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

describe('Login terms acceptance flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends acceptedTerms=false when user signs in with Google without checking terms', async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByRole('button', { name: /continuar con google/i }));

    expect(signInWithGoogleMock).toHaveBeenCalledTimes(1);
    expect(signInWithGoogleMock).toHaveBeenCalledWith(
      expect.objectContaining({
        acceptedTerms: false,
        termsVersion: 'v1',
        termsAcceptedAt: expect.any(String),
      })
    );
  });

  it('sends acceptedTerms=true when user checks terms and signs in with Google', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    await user.click(screen.getByRole('button', { name: /continuar con google/i }));

    expect(signInWithGoogleMock).toHaveBeenCalledTimes(1);
    expect(signInWithGoogleMock).toHaveBeenCalledWith(
      expect.objectContaining({
        acceptedTerms: true,
        termsVersion: 'v1',
        termsAcceptedAt: expect.any(String),
      })
    );
  });

  it('sends payload to email sign in with form values', async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /enviar enlace mágico/i }));

    await waitFor(() => {
      expect(signInWithEmailMock).toHaveBeenCalledTimes(1);
    });

    expect(signInWithEmailMock).toHaveBeenCalledWith(
      'test@example.com',
      expect.objectContaining({
        acceptedTerms: false,
        termsVersion: 'v1',
        termsAcceptedAt: expect.any(String),
      })
    );
  });
});
