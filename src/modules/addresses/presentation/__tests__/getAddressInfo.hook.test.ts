import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useGetAddressInfo } from '../getAddressInfo.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

vi.mock('@tanstack/react-query');
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

  it('calls useQuery with correct config', () => {
    (useQuery as any).mockReturnValue({ data: [], isLoading: false });

    const { result } = renderHook(() => useGetAddressInfo({ osmId: 'R123' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getAddressInfo, 'R123'],
        enabled: true,
      })
    );
    expect(result.current.data).toEqual([]);
  });

  it('disables query when osmId is empty', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false });

    renderHook(() => useGetAddressInfo({ osmId: '' }));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('invokes queryFn which delegates to getAddressInfo', async () => {
    const queryFn = vi.fn().mockResolvedValue([]);
    (useQuery as any).mockImplementation((options: any) => {
      queryFn.mockImplementation(options.queryFn);
      return { data: null, isLoading: false };
    });

    renderHook(() => useGetAddressInfo({ osmId: 'R789' }));

    const result = await queryFn();
    expect(result).toEqual([]);
  });
});
