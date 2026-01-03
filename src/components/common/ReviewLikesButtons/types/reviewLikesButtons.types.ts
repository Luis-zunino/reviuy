import type { VoteType } from '@/types';

export interface ReviewLikesButtonsProps {
  id: string;
  likes: number;
  dislikes: number;
  userVote?: VoteType;
  className?: string;
}
