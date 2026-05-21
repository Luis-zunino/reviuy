import type { VoteType } from '@/types/vote-type';

export interface RealEstateVoteButtonsProps {
  realEstateId: string;
  likes: number;
  dislikes: number;
  userVote: VoteType;
  className?: string;
  refetchRealEstate: () => Promise<void>;
  isLoading: boolean;
}
