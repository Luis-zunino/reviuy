import { voteRealEstateReviewAction } from '@/modules/real-estates/presentation';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';
import { VoteRealEstateReviewParams } from './types';

export const useVoteRealEstateReview = () => {
  return useAuthMutation({
    mutationFn: ({ reviewId, voteType }: VoteRealEstateReviewParams) =>
      voteRealEstateReviewAction(reviewId, voteType),
    invalidateQueryKeys: [[REAL_ESTATE_REVIEWS.getUserRealEstateReviewVote]],
  });
};
