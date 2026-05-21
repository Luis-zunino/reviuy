import { VoteType } from '@/types/vote-type';

export interface VoteState {
  likesCount: number;
  dislikesCount: number;
  currentVote: VoteType;
}
