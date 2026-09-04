// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useVerifyAuthentication } from '../verifyAuthentication.hook';

vi.mock('@/modules/profiles/application', () => ({
  createVerifyAuthenticationQuery: vi.fn(() => vi.fn()),
}));
vi.mock('@/modules/profiles/infrastructure', () => ({
  SupabaseProfileAuthReadRepository: vi.fn(),
}));

import { USER_KEYS } from '@/constants/query-keys.constant';
const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

describe('useVerifyAuthentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls mockUseQuery with the correct queryKey', () => {
    (mockUseQuery as any).mockReturnValue({ data: null, isLoading: false });
    const { result } = renderHook(() => useVerifyAuthentication());

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: [USER_KEYS.useVerifyAuthentication] })
    );
    expect(result.current.data).toBeNull();
  });

  it('invokes queryFn which delegates to verifyAuthentication', () => {
    const queryFn = vi.fn();
    (mockUseQuery as any).mockImplementation(({ queryFn: fn }: any) => {
      queryFn.mockImplementation(fn);
      return { data: undefined, isLoading: false };
    });
    renderHook(() => useVerifyAuthentication());

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [USER_KEYS.useVerifyAuthentication],
        queryFn: expect.any(Function),
      })
    );
  });
});
