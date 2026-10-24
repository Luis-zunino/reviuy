// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useCheckUserReviewForAddress } from '../checkUserReviewForAddress.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';
const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: {} as any,
}));
vi.mock('@/modules/property-reviews', () => ({
  createCheckUserReviewForAddressQuery: vi.fn(() => vi.fn()),
  SupabasePropertyReviewReadRepository: vi.fn(),
}));

describe('useCheckUserReviewForAddress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data when mockUseQuery succeeds', () => {
    const mockData = { id: 'review-1' };
    (mockUseQuery as any).mockReturnValue({ data: mockData, isLoading: false, error: null });

    const { result } = renderHook(() => useCheckUserReviewForAddress({ osmId: 'osm-123' }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.checkUserReviewForAddress, 'osm-123'],
        enabled: true,
      })
    );
    expect(result.current.data).toEqual(mockData);
  });

  it('disables query when osmId is not provided', () => {
    (mockUseQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    renderHook(() => useCheckUserReviewForAddress({}));

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('returns null data when no review exists', () => {
    (mockUseQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    const { result } = renderHook(() => useCheckUserReviewForAddress({ osmId: 'osm-456' }));

    expect(result.current.data).toBeNull();
  });

  it('invokes queryFn', async () => {
    (mockUseQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useCheckUserReviewForAddress({ osmId: 'osm-123' }));

    const qf = (mockUseQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });

  it('invokes queryFn with empty string fallback when osmId is null', async () => {
    (mockUseQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useCheckUserReviewForAddress({ osmId: undefined }));

    const qf = (mockUseQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
