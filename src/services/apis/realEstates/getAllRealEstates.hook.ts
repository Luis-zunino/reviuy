import { useQuery } from '@tanstack/react-query';
import { getAllRealEstates } from './getAllRealEstates';
import { REAL_ESTATE_REVIEWS } from '@/services/constants';
import type { UseGetAllRealEstatesParams } from './types';

export const useGetAllRealEstates = ({ limit }: UseGetAllRealEstatesParams = {}) => {
  return useQuery({
    queryKey: [...REAL_ESTATE_REVIEWS.getAllRealEstateReviews, limit],
    queryFn: () => getAllRealEstates({ limit }),
    staleTime: 1000 * 60 * 5,
  });
};
