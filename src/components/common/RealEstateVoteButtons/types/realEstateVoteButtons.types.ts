import type { VoteType } from '@/types';

export interface RealEstateVoteButtonsProps {
  realEstateId: string;
  likes: number;
  dislikes: number;
  userVote?: VoteType | null;
  className?: string;
  refetchRealEstate: () => Promise<void>;
  isLoading: boolean;
}
