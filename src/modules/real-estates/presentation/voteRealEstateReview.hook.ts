import { voteRealEstateReviewAction } from '@/modules/real-estates/presentation';
import { useAuthMutation } from '@/shared/auth';
import { VoteRealEstateReviewParams } from './types';

export const useVoteRealEstateReview = () => {
  return useAuthMutation({
    mutationFn: ({ reviewId, voteType }: VoteRealEstateReviewParams) =>
      voteRealEstateReviewAction(reviewId, voteType),
  });
};
