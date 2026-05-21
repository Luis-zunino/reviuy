import { voteReviewAction } from '@/modules/property-reviews/presentation';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';
import { VoteType } from '@/types/vote-type';

export interface UseVoteReviewProps {
  reviewId: string;
  voteType: VoteType;
}

export const useVoteReview = () => {
  return useAuthMutation({
    mutationFn: ({ reviewId, voteType }: UseVoteReviewProps) =>
      voteReviewAction(reviewId, voteType),
    invalidateQueryKeys: [[REVIEW_KEYS.getUserReviewVote], [REVIEW_KEYS.getReviewById]],
  });
};
