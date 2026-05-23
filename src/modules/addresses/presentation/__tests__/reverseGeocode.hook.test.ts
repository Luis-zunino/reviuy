import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useReverseGeocode } from '../reverseGeocode.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

vi.mock('@tanstack/react-query');
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

  it('calls useQuery with correct config when enabled', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false });

    const { result } = renderHook(() => useReverseGeocode({ lat: -34.9011, lon: -56.1645 }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.reverseGeocode, -34.9011, -56.1645],
        enabled: true,
      }),
    );
    expect(result.current.data).toBeNull();
  });

  it('disables query when lat is null', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false });

    renderHook(() => useReverseGeocode({ lat: null, lon: -56.1645 }));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('disables query when lon is null', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false });

    renderHook(() => useReverseGeocode({ lat: -34.9011, lon: null }));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('invokes queryFn which delegates to reverseGeocode', async () => {
    const queryFn = vi.fn().mockResolvedValue(null);
    (useQuery as any).mockImplementation((options: any) => {
      queryFn.mockImplementation(options.queryFn);
      return { data: null, isLoading: false };
    });

    renderHook(() => useReverseGeocode({ lat: -34.9011, lon: -56.1645 }));

    const result = await queryFn();
    expect(result).toBeNull();
  });
});
