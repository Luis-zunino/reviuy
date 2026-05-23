import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useVoteRealEstateReview } from '../voteRealEstateReview.hook';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { voteRealEstateReviewAction } from '@/modules/real-estates/presentation';
import { VoteType } from '@/types/vote-type';

vi.mock('@/shared/auth/useAuthMutation.hook', () => ({
  useAuthMutation: vi.fn(({ mutationFn }) => ({
    mutate: mutationFn,
    mutateAsync: mutationFn,
    isPending: false,
    data: null,
    error: null,
  })),
}));
vi.mock('@/modules/real-estates/presentation', () => ({
  voteRealEstateReviewAction: vi.fn(),
}));

describe('useVoteRealEstateReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useAuthMutation con la configuración esperada', () => {
    renderHook(() => useVoteRealEstateReview());

    expect(useAuthMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationFn: expect.any(Function),
        invalidateQueryKeys: [['getUserRealEstateReviewVote']],
      })
    );
  });

  it('debe retornar el objeto de mutación', () => {
    const { result } = renderHook(() => useVoteRealEstateReview());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current.isPending).toBe(false);
  });

  it('debe llamar a voteRealEstateReviewAction al mutar', async () => {
    const { result } = renderHook(() => useVoteRealEstateReview());

    const input = { reviewId: 'review-123', voteType: VoteType.LIKE };
    await result.current.mutateAsync(input);

    expect(voteRealEstateReviewAction).toHaveBeenCalledWith('review-123', VoteType.LIKE);
  });
});
