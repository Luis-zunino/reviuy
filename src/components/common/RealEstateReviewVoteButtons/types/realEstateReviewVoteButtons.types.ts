import { RealEstateReviewWithVotesPublic } from '@/modules/real-estates';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

export interface RealEstateReviewVoteButtonsProps {
  reviewId: string;
  likes: number;
  dislikes: number;
  className?: string;
  refetchRealEstateReview?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<RealEstateReviewWithVotesPublic | null, Error>>;
}
