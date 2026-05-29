import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthCallback from '../page';
import { PagesUrls } from '@/enums';

const { locationAssignMock, getSessionMock, getUserMock, updateUserMock } = vi.hoisted(() => ({
  locationAssignMock: vi.fn(),
  getSessionMock: vi.fn(),
  getUserMock: vi.fn(),
  updateUserMock: vi.fn(),
}));

vi.stubGlobal('location', { assign: locationAssignMock, search: '' });

vi.mock('@/modules/profiles/application', () => ({
  createGetSessionQuery: () => getSessionMock,
}));

vi.mock('@/modules/profiles/infrastructure', () => ({
  SupabaseProfileAuthReadRepository: class SupabaseProfileAuthReadRepository {},
}));

vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: {
    auth: {
      getUser: getUserMock,
      updateUser: updateUserMock,
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('AuthCallback terms check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('location', {
      assign: locationAssignMock,
      search: '',
      href: '',
    });
    globalThis.history.pushState({}, '', '/auth/callback');

    getSessionMock.mockResolvedValue({
      session: { userId: 'user-1' },
      error: null,
    });

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

  it('redirects home when user already accepted latest terms version', async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          user_metadata: { terms_accepted_at: '2026-01-01T00:00:00.000Z', terms_version: 'v2' },
        },
      },
      error: null,
    });

    render(<AuthCallback />);

    await waitFor(() => {
      expect(locationAssignMock).toHaveBeenCalledWith(PagesUrls.HOME);
    });
  });

  it('redirects to accept-terms when user has not accepted terms', async () => {
    render(<AuthCallback />);

    await waitFor(() => {
      expect(locationAssignMock).toHaveBeenCalledWith(PagesUrls.ACCEPT_TERMS);
    });
  });

  it('redirects to accept-terms when user has old terms_version', async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          user_metadata: { terms_accepted_at: '2026-01-01T00:00:00.000Z', terms_version: 'v1' },
        },
      },
      error: null,
    });

    render(<AuthCallback />);

    await waitFor(() => {
      expect(locationAssignMock).toHaveBeenCalledWith(PagesUrls.ACCEPT_TERMS);
    });
  });

  it('redirects to login when session query fails', async () => {
    getSessionMock.mockResolvedValueOnce({
      session: null,
      error: new Error('session error'),
    });

    render(<AuthCallback />);

    await waitFor(() => {
      expect(locationAssignMock).toHaveBeenCalledWith(PagesUrls.LOGIN);
    });
  });
});
