import { VoteType } from '@/types';

export interface VoteState {
  likesCount: number;
  dislikesCount: number;
  currentVote: VoteType;
}
