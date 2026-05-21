import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthCallback from '../page';
import { PagesUrls } from '@/enums';

const { locationAssignMock, getSessionMock, getUserMock, updateUserMock, signOutMock } = vi.hoisted(
  () => ({
    locationAssignMock: vi.fn(),
    getSessionMock: vi.fn(),
    getUserMock: vi.fn(),
    updateUserMock: vi.fn(),
    signOutMock: vi.fn(),
  })
);

vi.stubGlobal('location', { assign: locationAssignMock, search: '' });

vi.mock('@/modules/profiles/application', () => ({
  createGetSessionQuery: () => getSessionMock,
}));

vi.mock('@/modules/profiles/infrastructure', () => ({
  SupabaseProfileAuthReadRepository: class SupabaseProfileAuthReadRepository {},
}));

vi.mock('@/lib/supabase', () => ({
  supabaseClient: {
    auth: {
      getUser: getUserMock,
      updateUser: updateUserMock,
      signOut: signOutMock,
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('AuthCallback terms persistence', () => {
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
    signOutMock.mockResolvedValue({ error: null });
  });

  it('redirects home without updating metadata when user already accepted terms', async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          user_metadata: { terms_accepted_at: '2026-01-01T00:00:00.000Z' },
        },
      },
      error: null,
    });

    render(<AuthCallback />);

    await waitFor(() => {
      expect(locationAssignMock).toHaveBeenCalledWith(PagesUrls.HOME);
    });

    expect(updateUserMock).not.toHaveBeenCalled();
    expect(signOutMock).not.toHaveBeenCalled();
  });

  it('updates metadata from redirect params and redirects home for first acceptance', async () => {
    (globalThis.location as Record<string, unknown>).search =
      '?terms_accepted=1&terms_accepted_at=2026-04-11T10:00:00.000Z&terms_version=v1';

    render(<AuthCallback />);

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledTimes(1);
    });

    expect(updateUserMock).toHaveBeenCalledWith({
      data: {
        terms_accepted_at: '2026-04-11T10:00:00.000Z',
        privacy_accepted_at: '2026-04-11T10:00:00.000Z',
        terms_version: 'v1',
      },
    });

    expect(locationAssignMock).toHaveBeenCalledWith(PagesUrls.HOME);
    expect(signOutMock).not.toHaveBeenCalled();
  });

  it('signs out and redirects to login when first login has no acceptance params', async () => {
    render(<AuthCallback />);

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalledTimes(1);
    });

    expect(locationAssignMock).toHaveBeenCalledWith(PagesUrls.LOGIN);
    expect(updateUserMock).not.toHaveBeenCalled();
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
