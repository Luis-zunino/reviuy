import { VoteType } from '@/types/vote-type';

export interface VoteReviewRequest {
  reviewId: string;
  voteType: VoteType;
}
