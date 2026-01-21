import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { VoteType } from '@/types';
import { getUserRealEstateVote } from './getUserRealEstateVote.api';
import { REAL_ESTATE_REVIEWS } from '@/services/constants';

export interface useGetUserRealEstateVoteParams {
  realEstateId: string;
  userId?: string | null;
}
export const useGetUserRealEstateVote = ({
  realEstateId,
  userId,
}: useGetUserRealEstateVoteParams): UseQueryResult<VoteType | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getUserRealEstateVote, realEstateId, userId],
    queryFn: () => getUserRealEstateVote({ realEstateId, userId: userId || '' }),
    enabled: Boolean(userId) && Boolean(realEstateId),
  });
};
