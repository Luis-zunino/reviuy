import { voteRealEstateAction } from '@/modules/real-estates/presentation';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';
import { VoteRealEstateParams } from './types';

export const useVoteRealEstate = () => {
  return useAuthMutation({
    mutationFn: ({ realEstateId, voteType }: VoteRealEstateParams) =>
      voteRealEstateAction(realEstateId, voteType),
    invalidateQueryKeys: [[REAL_ESTATE_REVIEWS.getUserRealEstateVote]],
  });
};
