import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useToggleFavoriteReview } from '../useToggleFavoriteReview.hook';
import { toggleFavoriteReviewAction } from '@/modules/property-reviews/presentation';

vi.mock('@/shared/api', () => ({
  useToggleFavorite: vi.fn((mutationFn: any) => ({
    mutate: mutationFn,
    mutateAsync: mutationFn,
    isPending: false,
    data: null,
    error: null,
  })),
}));

vi.mock('@/modules/property-reviews/presentation', () => ({
  toggleFavoriteReviewAction: vi.fn(),
}));

describe('useToggleFavoriteReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mutation object with expected properties', () => {
    const { result } = renderHook(() => useToggleFavoriteReview());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('mutateAsync');
    expect(result.current).toHaveProperty('isPending');
  });

  it('calls toggleFavoriteReviewAction on mutate', async () => {
    const { result } = renderHook(() => useToggleFavoriteReview());

    await result.current.mutateAsync({ reviewId: 'review-123' });

    expect(toggleFavoriteReviewAction).toHaveBeenCalledWith('review-123');
  });
});
