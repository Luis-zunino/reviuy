import { VoteType } from '@/types';

export interface UseVoteButtonsOptions {
  likes: number;
  dislikes: number;
  userVote: VoteType;
  onVote: (voteType: VoteType) => Promise<void>;
  onError?: (error: Error) => void;
}
