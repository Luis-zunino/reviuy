import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { RealEstateReviewWithVotesPublic } from '@/types';
import { REAL_ESTATE_REVIEWS } from '@/services/constants';
import { getRealEstateReviewByIdApi } from './getRealEstateReviewByIdApi.api';

export const useGetRealEstateReviewById = ({
  reviewId,
}: {
  reviewId: string;
}): UseQueryResult<RealEstateReviewWithVotesPublic | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getRealEstateReviewById],
    queryFn: () => getRealEstateReviewByIdApi({ reviewId }),
  });
};
