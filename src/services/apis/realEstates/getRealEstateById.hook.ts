import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { RealEstate } from '@/types';
import { REAL_ESTATE_REVIEWS } from '@/services/constants';
import { getRealEstateByIdApi } from './getRealEstateById.api';

export const useGetRealEstateById = (id: string): UseQueryResult<RealEstate | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getRealEstateById, id],
    queryFn: () => getRealEstateByIdApi(id),
    enabled: !!id,
  });
};
