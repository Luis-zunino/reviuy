import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getAllRealEstateReviewsApi } from './getAllRealEstateReviews.api';
import type { RealEstateReviewWithVotesPublic } from '@/types';
import { REAL_ESTATE_REVIEWS } from '@/services/constants';
import { GetAllRealEstateReviews } from './types';

export const useGetAllRealEstateReviews = ({
  id,
  limit,
}: GetAllRealEstateReviews): UseQueryResult<RealEstateReviewWithVotesPublic[] | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getAllRealEstateReviews, limit],
    queryFn: () => getAllRealEstateReviewsApi({ id, limit }),
  });
};
