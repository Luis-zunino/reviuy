import { voteRealEstate } from './voteRealEstate.api';
import type { VoteRealEstateParams } from './types';
import { useAuthMutation } from '../user';

export const useVoteRealEstate = () => {
  return useAuthMutation({
    mutationFn: async (props: VoteRealEstateParams) => {
      return await voteRealEstate(props);
    },
  });
};
