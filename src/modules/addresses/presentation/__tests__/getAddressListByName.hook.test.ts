// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useGetAddressListByName } from '../getAddressListByName.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';
const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

vi.mock('@/modules/addresses/application', () => ({
  createSearchAddressByNameQuery: vi.fn(() => vi.fn().mockResolvedValue([])),
}));
vi.mock('@/modules/addresses/infrastructure', () => ({
  NominatimAddressReadRepository: vi.fn(),
}));

describe('useGetAddressListByName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls mockUseQuery with correct config', () => {
    (mockUseQuery as any).mockReturnValue({ data: [], isLoading: false });

    const { result } = renderHook(() => useGetAddressListByName({ query: 'Avenida Italia' }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getAddressListByName, 'Avenida Italia'],
        enabled: true,
      })
    );
    expect(result.current.data).toEqual([]);
  });

  it('disables query when query length is 7 or less', () => {
    (mockUseQuery as any).mockReturnValue({ data: null, isLoading: false });

    renderHook(() => useGetAddressListByName({ query: 'short' }));

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('passes query params to queryKey', () => {
    (mockUseQuery as any).mockReturnValue({ data: [], isLoading: false });

    renderHook(() => useGetAddressListByName({ query: 'Sarandi', limit: 10, countrycodes: 'ar' }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getAddressListByName, 'Sarandi'],
      })
    );
  });

  it('invokes queryFn which delegates to searchAddressByName', async () => {
    const queryFn = vi.fn().mockResolvedValue([]);
    (mockUseQuery as any).mockImplementation((options: any) => {
      queryFn.mockImplementation(options.queryFn);
      return { data: null, isLoading: false };
    });

    renderHook(() => useGetAddressListByName({ query: 'Test' }));

    const result = await queryFn();
    expect(result).toEqual([]);
  });
});
