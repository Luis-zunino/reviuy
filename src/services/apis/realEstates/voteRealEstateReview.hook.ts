import { voteRealEstateReview } from './voteRealEstateReview.api';
import type { VoteRealEstateReviewParams } from './types';
import { useAuthMutation } from '../user';

export const useVoteRealEstateReview = () => {
  return useAuthMutation({
    mutationFn: async (props: VoteRealEstateReviewParams) => {
      return await voteRealEstateReview(props);
    },
  });
};
