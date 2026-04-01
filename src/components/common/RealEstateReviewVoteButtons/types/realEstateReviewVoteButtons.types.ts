import { RealEstateReviewWithVotesPublic } from '@/modules/real-estates';
import type { VoteType } from '@/types';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

export interface RealEstateReviewVoteButtonsProps {
  reviewId: string;
  likes: number;
  dislikes: number;
  userVote?: VoteType | null;
  className?: string;
  refetchRealEstateReview?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<RealEstateReviewWithVotesPublic | null, Error>>;
}
