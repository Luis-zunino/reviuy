import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateReview } from '../updateReview.hook';
import { updateReviewAction } from '@/modules/property-reviews/presentation';

vi.mock('@/modules/property-reviews/presentation', () => ({
  updateReviewAction: vi.fn(),
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

describe('useUpdateReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mutation object with expected properties', () => {
    const { result } = renderHook(() => useUpdateReview());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('mutateAsync');
    expect(result.current).toHaveProperty('isPending');
  });

  it('calls updateReviewAction on mutate', async () => {
    const { result } = renderHook(() => useUpdateReview());

    const input = { reviewId: 'review-123', updateData: { title: 'Updated' } };
    await result.current.mutateAsync(input);

    expect(updateReviewAction).toHaveBeenCalledWith('review-123', { title: 'Updated' });
  });
});
