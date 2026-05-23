import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useIsReviewFavorite } from '../useIsReviewFavorite.hook';

vi.mock('@tanstack/react-query');
vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: {} as any,
}));
vi.mock('@/modules/property-reviews', () => ({
  createIsReviewFavoriteQuery: vi.fn(() => vi.fn()),
  SupabasePropertyReviewReadRepository: vi.fn(),
}));

describe('useIsReviewFavorite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true when review is a favorite', () => {
    (useQuery as any).mockReturnValue({ data: true, isLoading: false, error: null });

    const { result } = renderHook(() => useIsReviewFavorite({ reviewId: 'review-123' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['isFavoriteReview', 'review-123'],
        enabled: true,
        staleTime: 0,
      })
    );
    expect(result.current.data).toBe(true);
  });

  it('returns false when review is not a favorite', () => {
    (useQuery as any).mockReturnValue({ data: false, isLoading: false, error: null });

    const { result } = renderHook(() => useIsReviewFavorite({ reviewId: 'review-456' }));

    expect(result.current.data).toBe(false);
  });

  it('disables query when reviewId is empty', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    renderHook(() => useIsReviewFavorite({ reviewId: '' }));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('invokes queryFn', async () => {
    (useQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useIsReviewFavorite({ reviewId: 'review-123' }));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
