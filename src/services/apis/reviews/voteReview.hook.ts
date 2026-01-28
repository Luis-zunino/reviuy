import { voteReview } from './voteReview.api';
import { useAuthMutation } from '../user';

export const useVoteReview = () => {
  return useAuthMutation({
    mutationFn: voteReview,
  });
};
