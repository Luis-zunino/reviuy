import { voteRealEstateAction } from '@/app/_actions/real-estate-interactions.actions';
import { useAuthMutation } from '../user';
import { VoteRealEstateParams } from './types';

export const useVoteRealEstate = () => {
  return useAuthMutation({
    mutationFn: ({ realEstateId, voteType }: VoteRealEstateParams) =>
      voteRealEstateAction(realEstateId, voteType),
  });
};
