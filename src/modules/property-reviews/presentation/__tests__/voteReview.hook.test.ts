import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useVoteReview } from '../voteReview.hook';
import { voteReviewAction } from '@/modules/property-reviews/presentation';
import { VoteType } from '@/types/vote-type';

vi.mock('@/modules/property-reviews/presentation', () => ({
  voteReviewAction: vi.fn(),
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

describe('useVoteReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mutation object with expected properties', () => {
    const { result } = renderHook(() => useVoteReview());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('mutateAsync');
    expect(result.current).toHaveProperty('isPending');
  });

  it('calls voteReviewAction on mutate', async () => {
    const { result } = renderHook(() => useVoteReview());

    const input = { reviewId: 'review-123', voteType: VoteType.LIKE };
    await result.current.mutateAsync(input);

    expect(voteReviewAction).toHaveBeenCalledWith('review-123', VoteType.LIKE);
  });
});
