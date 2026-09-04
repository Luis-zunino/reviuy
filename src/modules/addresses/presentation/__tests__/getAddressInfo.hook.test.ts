// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useGetAddressInfo } from '../getAddressInfo.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';
const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

vi.mock('@/modules/addresses/application', () => ({
  createGetAddressInfoQuery: vi.fn(() => vi.fn().mockResolvedValue([])),
}));
vi.mock('@/modules/addresses/infrastructure', () => ({
  NominatimAddressReadRepository: vi.fn(),
}));

describe('useGetAddressInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls mockUseQuery with correct config', () => {
    (mockUseQuery as any).mockReturnValue({ data: [], isLoading: false });

    const { result } = renderHook(() => useGetAddressInfo({ osmId: 'R123' }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getAddressInfo, 'R123'],
        enabled: true,
      })
    );
    expect(result.current.data).toEqual([]);
  });

  it('disables query when osmId is empty', () => {
    (mockUseQuery as any).mockReturnValue({ data: null, isLoading: false });

    renderHook(() => useGetAddressInfo({ osmId: '' }));

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('invokes queryFn which delegates to getAddressInfo', async () => {
    const queryFn = vi.fn().mockResolvedValue([]);
    (mockUseQuery as any).mockImplementation((options: any) => {
      queryFn.mockImplementation(options.queryFn);
      return { data: null, isLoading: false };
    });

    renderHook(() => useGetAddressInfo({ osmId: 'R789' }));

    const result = await queryFn();
    expect(result).toEqual([]);
  });
});
