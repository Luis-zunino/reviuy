import { voteRealEstateReviewAction } from '@/modules/real-estates/presentation';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { VoteRealEstateReviewParams } from './types';

export const useVoteRealEstateReview = () => {
  return useAuthMutation({
    mutationFn: ({ reviewId, voteType }: VoteRealEstateReviewParams) =>
      voteRealEstateReviewAction(reviewId, voteType),
  });
};
