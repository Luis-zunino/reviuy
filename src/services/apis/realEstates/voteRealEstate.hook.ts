import { voteRealEstate } from './voteRealEstate.api';
import { useAuthMutation } from '../user';

export const useVoteRealEstate = () => {
  return useAuthMutation({
    mutationFn: voteRealEstate,
  });
};
