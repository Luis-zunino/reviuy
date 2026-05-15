import { voteReviewAction } from '@/modules/property-reviews/presentation';
import { useAuthMutation } from '@/shared/auth';
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
