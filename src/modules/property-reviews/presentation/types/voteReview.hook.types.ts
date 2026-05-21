import type { VoteType } from '@/types/vote-type';

export interface VoteReviewParams {
  reviewId: string;
  voteType: VoteType;
}
