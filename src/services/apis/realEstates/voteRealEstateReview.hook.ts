import { voteRealEstateReviewAction } from '@/app/_actions/real-estate-interactions.actions';
import { useAuthMutation } from '../user';
import { VoteRealEstateReviewParams } from './types';

export const useVoteRealEstateReview = () => {
  return useAuthMutation({
    mutationFn: ({ reviewId, voteType }: VoteRealEstateReviewParams) =>
      voteRealEstateReviewAction(reviewId, voteType),
  });
};
