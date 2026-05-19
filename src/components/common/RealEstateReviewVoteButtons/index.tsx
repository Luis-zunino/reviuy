'use client';

import { VoteButtons } from '../VoteButtons';
import { useRealEstateReviewVoteButtons } from './hooks';
import type { RealEstateReviewVoteButtonsProps } from './types';

export const RealEstateReviewVoteButtons: React.FC<RealEstateReviewVoteButtonsProps> = (props) => {
  const { reviewId, likes, dislikes, className, refetchRealEstateReview } = props;
  const { handleVote, isPending, userVote } = useRealEstateReviewVoteButtons({
    reviewId,
    refetchRealEstateReview,
  });

  return (
    <VoteButtons
      likes={likes}
      dislikes={dislikes}
      userVote={userVote}
      onVote={handleVote}
      disabled={isPending}
      className={className}
    />
  );
};
