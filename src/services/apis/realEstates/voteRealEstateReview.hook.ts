import { voteRealEstateReview } from './voteRealEstateReview.api';
import { useAuthMutation } from '../user';

export const useVoteRealEstateReview = () => {
  return useAuthMutation({
    mutationFn: voteRealEstateReview,
  });
};
