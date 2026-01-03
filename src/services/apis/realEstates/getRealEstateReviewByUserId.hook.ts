import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { RealEstateReview } from '@/types';
import { REAL_ESTATE_REVIEWS } from '@/services/constants';
import { getRealEstateReviewByUserIdApi } from './getRealEstateReviewByUserId.api';

export const useGetRealEstateReviewByUserId = ({
  userId,
  realEstateId,
}: {
  userId: string;
  realEstateId: string;
}): UseQueryResult<RealEstateReview | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getRealEstateReviewByUserId, userId, realEstateId],
    queryFn: () => getRealEstateReviewByUserIdApi({ userId, realEstateId }),
    enabled: Boolean(userId) && Boolean(realEstateId),
  });
};
