// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AcceptTerms } from '../AcceptTerms';
import { LEGAL_TERMS_SECTIONS, CURRENT_TERMS_VERSION } from '@/constants/legal-terms.constant';
import { PagesUrls } from '@/enums';

const { locationAssignMock, getUserMock, updateUserMock } = vi.hoisted(() => ({
  locationAssignMock: vi.fn(),
  getUserMock: vi.fn(),
  updateUserMock: vi.fn(),
}));

vi.stubGlobal('location', { assign: locationAssignMock, href: '' });

// IntersectionObserver mock — must be a proper constructor
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
let intersectionCallback: (entries: { isIntersecting: boolean }[]) => void = () => {};

vi.stubGlobal(
  'IntersectionObserver',
  class {
    constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
      intersectionCallback = callback;
    }
    observe = mockObserve;
    disconnect = mockDisconnect;
    unobserve = vi.fn();
  }
);

vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: {
    auth: {
      getUser: getUserMock,
      updateUser: updateUserMock,
    },
  },
}));

vi.mock('@/components/providers/AuthProvider', () => ({
  useAuthContext: () => ({
    loading: false,
    isAuthenticated: true,
    signOut: vi.fn(),
    signInWithEmail: vi.fn(),
    signInWithGoogle: vi.fn(),
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('AcceptTerms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    intersectionCallback = () => {};
    vi.stubGlobal('location', { assign: locationAssignMock, href: '' });

    // Default: user has NOT accepted terms yet
    getUserMock.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          user_metadata: {},
        },
      },
      error: null,
    });

    updateUserMock.mockResolvedValue({ error: null });
  });

  it('renders summary and full terms text', async () => {
    render(<AcceptTerms />);

    // Wait for the guard check to complete
    await waitFor(() => {
      expect(screen.getByText('Aceptar Términos y Condiciones')).toBeInTheDocument();
    });

    // Check summary section titles are rendered (wrapped in <strong>)
    // Use getAllByText — titles appear both in summary and in full terms text
    for (const section of LEGAL_TERMS_SECTIONS) {
      const matches = screen.getAllByText(new RegExp(section.title, 'i'));
      expect(matches.length).toBeGreaterThanOrEqual(1);
    }

    // Check full terms text is rendered
    expect(screen.getByText(/1\. Aceptación/)).toBeInTheDocument();
    expect(screen.getByText(/6\. Responsabilidad Técnica y Fallas de Sistema/)).toBeInTheDocument();
  });

  it('has button disabled before scrolling to bottom', async () => {
    render(<AcceptTerms />);

    await waitFor(() => {
      expect(screen.getByText('Aceptar Términos y Condiciones')).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /aceptar y continuar/i });
    expect(button).toBeDisabled();
  });

  it('enables button when scrolled to bottom and accepting terms calls updateUser and redirects', async () => {
    render(<AcceptTerms />);

    await waitFor(() => {
      expect(screen.getByText('Aceptar Términos y Condiciones')).toBeInTheDocument();
    });

    // Simulate scroll to bottom via IntersectionObserver
    intersectionCallback([{ isIntersecting: true }]);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /aceptar y continuar/i });
      expect(button).not.toBeDisabled();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /aceptar y continuar/i }));

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledTimes(1);
      expect(updateUserMock).toHaveBeenCalledWith({
        data: {
          terms_accepted_at: expect.any(String),
          terms_version: CURRENT_TERMS_VERSION,
        },
      });
      expect(locationAssignMock).toHaveBeenCalledWith(PagesUrls.HOME);
    });
  });

  it('shows error toast when updateUser fails', async () => {
    const { toast } = await import('sonner');
    const toastError = vi.mocked(toast.error);
    updateUserMock.mockResolvedValue({ error: new Error('Update failed') });

    render(<AcceptTerms />);

    await waitFor(() => {
      expect(screen.getByText('Aceptar Términos y Condiciones')).toBeInTheDocument();
    });

    // Simulate scroll to bottom
    intersectionCallback([{ isIntersecting: true }]);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /aceptar y continuar/i })).not.toBeDisabled();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /aceptar y continuar/i }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Error al aceptar términos', expect.any(Object));
    });

    // Should NOT redirect
    expect(locationAssignMock).not.toHaveBeenCalledWith(PagesUrls.HOME);
  });

  it('redirects to home if user already has terms_accepted_at', async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          user_metadata: { terms_accepted_at: '2026-05-01T00:00:00.000Z' },
        },
      },
      error: null,
    });

    render(<AcceptTerms />);

    await waitFor(() => {
      expect(locationAssignMock).toHaveBeenCalledWith(PagesUrls.HOME);
    });
  });
});
