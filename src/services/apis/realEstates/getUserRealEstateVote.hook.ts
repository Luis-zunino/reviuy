import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { VoteType } from '@/types';
import { getUserRealEstateVote } from './getUserRealEstateVote.api';
import { REAL_ESTATE_REVIEWS } from '@/services/constants';

export const useGetUserRealEstateVote = ({
  realEstateId,
  userId,
}: {
  realEstateId: string;
  userId?: string;
}): UseQueryResult<VoteType | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getUserRealEstateVote, realEstateId, userId],
    queryFn: () => getUserRealEstateVote({ realEstateId, userId: userId || '' }),
    enabled: !!userId && !!realEstateId,
  });
};
