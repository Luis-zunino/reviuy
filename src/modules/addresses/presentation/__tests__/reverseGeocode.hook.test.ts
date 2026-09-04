// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useReverseGeocode } from '../reverseGeocode.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';
const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

vi.mock('@/modules/addresses/application', () => ({
  createReverseGeocodeQuery: vi.fn(() => vi.fn().mockResolvedValue(null)),
}));
vi.mock('@/modules/addresses/infrastructure', () => ({
  NominatimAddressReadRepository: vi.fn(),
}));

describe('useReverseGeocode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls mockUseQuery with correct config when enabled', () => {
    (mockUseQuery as any).mockReturnValue({ data: null, isLoading: false });

    const { result } = renderHook(() => useReverseGeocode({ lat: -34.9011, lon: -56.1645 }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.reverseGeocode, -34.9011, -56.1645],
        enabled: true,
      })
    );
    expect(result.current.data).toBeNull();
  });

  it('disables query when lat is null', () => {
    (mockUseQuery as any).mockReturnValue({ data: null, isLoading: false });

    renderHook(() => useReverseGeocode({ lat: null, lon: -56.1645 }));

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('disables query when lon is null', () => {
    (mockUseQuery as any).mockReturnValue({ data: null, isLoading: false });

    renderHook(() => useReverseGeocode({ lat: -34.9011, lon: null }));

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('invokes queryFn which delegates to reverseGeocode', async () => {
    const queryFn = vi.fn().mockResolvedValue(null);
    (mockUseQuery as any).mockImplementation((options: any) => {
      queryFn.mockImplementation(options.queryFn);
      return { data: null, isLoading: false };
    });

    renderHook(() => useReverseGeocode({ lat: -34.9011, lon: -56.1645 }));

    const result = await queryFn();
    expect(result).toBeNull();
  });
});
