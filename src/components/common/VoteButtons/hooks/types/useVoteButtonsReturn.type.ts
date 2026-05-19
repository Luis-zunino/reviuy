import { VoteType } from '@/types';

export interface UseVoteButtonsReturn {
  handleVote: (voteType: VoteType) => void;
  clickedButton: VoteType | null;
  optimisticLikes: number;
  optimisticDislikes: number;
  optimisticUserVote: VoteType;
  isPending: boolean;
}
