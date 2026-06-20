// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useGetAddressListByName } from '../getAddressListByName.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

vi.mock('@tanstack/react-query');
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

  it('calls useQuery with correct config', () => {
    (useQuery as any).mockReturnValue({ data: [], isLoading: false });

    const { result } = renderHook(() => useGetAddressListByName({ query: 'Avenida Italia' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getAddressListByName, 'Avenida Italia'],
        enabled: true,
      })
    );
    expect(result.current.data).toEqual([]);
  });

  it('disables query when query length is 7 or less', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false });

    renderHook(() => useGetAddressListByName({ query: 'short' }));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('passes query params to queryKey', () => {
    (useQuery as any).mockReturnValue({ data: [], isLoading: false });

    renderHook(() => useGetAddressListByName({ query: 'Sarandi', limit: 10, countrycodes: 'ar' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getAddressListByName, 'Sarandi'],
      })
    );
  });

  it('invokes queryFn which delegates to searchAddressByName', async () => {
    const queryFn = vi.fn().mockResolvedValue([]);
    (useQuery as any).mockImplementation((options: any) => {
      queryFn.mockImplementation(options.queryFn);
      return { data: null, isLoading: false };
    });

    renderHook(() => useGetAddressListByName({ query: 'Test' }));

    const result = await queryFn();
    expect(result).toEqual([]);
  });
});
