// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PagesUrls } from '@/enums';

const { useAuthContextMock, LoginMock } = vi.hoisted(() => ({
  useAuthContextMock: vi.fn(),
  LoginMock: vi.fn(() => <div>Login Mock</div>),
  locationHrefMock: vi.fn(),
}));

vi.mock('@/components/providers/AuthProvider', () => ({
  useAuthContext: useAuthContextMock,
}));

vi.mock('@/components/features/Login', () => ({
  Login: LoginMock,
}));

describe('AuthPage (login page)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(globalThis, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  const renderPage = async () => {
    const { default: AuthPage } = await import('../page');
    render(<AuthPage />);
  };

  it('renders the Login component', async () => {
    useAuthContextMock.mockReturnValue({ isAuthenticated: false, loading: false });
    await renderPage();

    expect(screen.getByText('Login Mock')).toBeInTheDocument();
  });

  it('redirects to HOME when isAuthenticated is true and loading is false', async () => {
    useAuthContextMock.mockReturnValue({ isAuthenticated: true, loading: false });
    await renderPage();

    await waitFor(() => {
      expect(globalThis.location.href).toBe(PagesUrls.HOME);
    });
  });

  it('does NOT redirect when loading is true', async () => {
    useAuthContextMock.mockReturnValue({ isAuthenticated: true, loading: true });
    await renderPage();

    expect(globalThis.location.href).toBe('');
  });

  it('does NOT redirect when isAuthenticated is false', async () => {
    useAuthContextMock.mockReturnValue({ isAuthenticated: false, loading: false });
    await renderPage();

    expect(globalThis.location.href).toBe('');
  });
});
