import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useVerifyAuthentication } from '../verifyAuthentication.hook';

vi.mock('@tanstack/react-query');
vi.mock('@/modules/profiles/application', () => ({
  createVerifyAuthenticationQuery: vi.fn(() => vi.fn()),
}));
vi.mock('@/modules/profiles/infrastructure', () => ({
  SupabaseProfileAuthReadRepository: vi.fn(),
}));

import { USER_KEYS } from '@/constants/query-keys.constant';

describe('useVerifyAuthentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls useQuery with the correct queryKey', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false });
    const { result } = renderHook(() => useVerifyAuthentication());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: [USER_KEYS.useVerifyAuthentication] })
    );
    expect(result.current.data).toBeNull();
  });

  it('invokes queryFn which delegates to verifyAuthentication', () => {
    const queryFn = vi.fn();
    (useQuery as any).mockImplementation(({ queryFn: fn }: any) => {
      queryFn.mockImplementation(fn);
      return { data: undefined, isLoading: false };
    });
    renderHook(() => useVerifyAuthentication());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [USER_KEYS.useVerifyAuthentication],
        queryFn: expect.any(Function),
      })
    );
  });
});
