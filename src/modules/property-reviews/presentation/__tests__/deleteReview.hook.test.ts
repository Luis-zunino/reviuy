// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDeleteReview } from '../deleteReview.hook';
import { deleteReviewAction } from '@/modules/property-reviews/presentation';

vi.mock('@/modules/property-reviews/presentation', () => ({
  deleteReviewAction: vi.fn(),
}));

vi.mock('@/shared/auth/useAuthMutation.hook', () => ({
  useAuthMutation: vi.fn(({ mutationFn }) => ({
    mutate: mutationFn,
    mutateAsync: mutationFn,
    isPending: false,
    data: null,
    error: null,
  })),
}));

describe('useDeleteReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mutation object with expected properties', () => {
    const { result } = renderHook(() => useDeleteReview());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('mutateAsync');
    expect(result.current).toHaveProperty('isPending');
  });

  it('calls deleteReviewAction on mutate', async () => {
    const { result } = renderHook(() => useDeleteReview());

    await result.current.mutateAsync({ reviewId: 'review-123' });

    expect(deleteReviewAction).toHaveBeenCalledWith('review-123');
  });
});
