import { voteReviewAction } from '@/app/_actions/review-interactions.actions';
import { useAuthMutation } from '../user';
import { VoteType } from '@/types';

export interface UseVoteReviewProps {
  reviewId: string;
  voteType: VoteType;
}

export const useVoteReview = () => {
  return useAuthMutation({
    mutationFn: ({ reviewId, voteType }: UseVoteReviewProps) =>
      voteReviewAction(reviewId, voteType),
  });
};
