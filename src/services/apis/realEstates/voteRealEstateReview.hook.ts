import { voteRealEstateReviewAction } from '@/app/_actions/real-estate-interactions.actions';
import { useAuthMutation } from '../user';
import { VoteType } from '@/types';

export const useVoteRealEstateReview = () => {
  return useAuthMutation({
    mutationFn: ({ reviewId, voteType }: { reviewId: string; voteType: VoteType }) =>
      voteRealEstateReviewAction(reviewId, voteType),
  });
};
