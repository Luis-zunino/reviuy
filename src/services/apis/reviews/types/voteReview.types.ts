import { VoteType } from '@/types';

export interface VoteReviewRequest {
  reviewId: string;
  voteType: VoteType;
}
