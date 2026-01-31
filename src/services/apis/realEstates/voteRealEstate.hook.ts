import { voteRealEstateAction } from '@/app/_actions/real-estate-interactions.actions';
import { useAuthMutation } from '../user';
import { VoteType } from '@/types';

export const useVoteRealEstate = () => {
  return useAuthMutation({
    mutationFn: ({ realEstateId, voteType }: { realEstateId: string; voteType: VoteType }) =>
      voteRealEstateAction(realEstateId, voteType),
  });
};
