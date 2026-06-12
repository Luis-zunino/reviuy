// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useCheckUserReviewForAddress } from '../checkUserReviewForAddress.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

vi.mock('@tanstack/react-query');
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

  it('returns data when useQuery succeeds', () => {
    const mockData = { id: 'review-1' };
    (useQuery as any).mockReturnValue({ data: mockData, isLoading: false, error: null });

    const { result } = renderHook(() => useCheckUserReviewForAddress({ osmId: 'osm-123' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.checkUserReviewForAddress, 'osm-123'],
        enabled: true,
      })
    );
    expect(result.current.data).toEqual(mockData);
  });

  it('disables query when osmId is not provided', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    renderHook(() => useCheckUserReviewForAddress({}));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('returns null data when no review exists', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    const { result } = renderHook(() => useCheckUserReviewForAddress({ osmId: 'osm-456' }));

    expect(result.current.data).toBeNull();
  });

  it('invokes queryFn', async () => {
    (useQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useCheckUserReviewForAddress({ osmId: 'osm-123' }));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });

  it('invokes queryFn with empty string fallback when osmId is null', async () => {
    (useQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useCheckUserReviewForAddress({ osmId: undefined }));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
