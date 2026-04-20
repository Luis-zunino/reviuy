import { voteRealEstateAction } from '@/modules/real-estates/presentation';
import { useAuthMutation } from '@/shared/auth';
import { VoteRealEstateParams } from './types';

export const useVoteRealEstate = () => {
  return useAuthMutation({
    mutationFn: ({ realEstateId, voteType }: VoteRealEstateParams) =>
      voteRealEstateAction(realEstateId, voteType),
  });
};
