// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDeleteAccount } from '../useDeleteUser.hook';

vi.mock('@/shared/auth/useAuthMutation.hook', () => ({
  useAuthMutation: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));
vi.mock('@/modules/profiles/presentation', () => ({
  deleteAccountAction: vi.fn(),
}));

import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';

describe('useDeleteAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the mutation object from useAuthMutation', () => {
    const { result } = renderHook(() => useDeleteAccount());

    expect(result.current).toEqual({ mutate: expect.any(Function), isPending: false });
  });

  it('calls useAuthMutation with the deleteAccountAction and errorToastMessage config', () => {
    renderHook(() => useDeleteAccount());

    expect(useAuthMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationFn: expect.any(Function),
        errorToastMessage: expect.any(Function),
      })
    );
  });
});
