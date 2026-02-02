import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { VoteType } from '@/types';
import { getUserRealEstateVote } from './getUserRealEstateVote.api';
import { REAL_ESTATE_REVIEWS } from '@/services/constants';

export interface useGetUserRealEstateVoteParams {
  realEstateId: string;
}
export const useGetUserRealEstateVote = ({
  realEstateId,
}: useGetUserRealEstateVoteParams): UseQueryResult<VoteType | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getUserRealEstateVote, realEstateId],
    queryFn: () => getUserRealEstateVote({ realEstateId }),
    enabled: Boolean(realEstateId.length),
  });
};
