import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getAllRealEstateReviewsApi } from './getAllRealEstateReviews.api';
import type { RealEstateReview } from '@/types';
import { REAL_ESTATE_REVIEWS } from '@/services/constants';

export const useGetAllRealEstateReviews = ({
  id,
  limit,
}: {
  id: string;
  limit?: number;
}): UseQueryResult<RealEstateReview[] | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getAllRealEstateReviews, limit],
    queryFn: () => getAllRealEstateReviewsApi({ id, limit }),
  });
};
