import { REAL_ESTATE_REVIEWS } from '@/services/constants';
import { searchRealEstates } from './searchRealEstates.api';
import { SearchRealEstatesParams } from './types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { RealEstate } from '@/types';

export const useSearchRealEstates = ({
  query,
  limit,
}: SearchRealEstatesParams): UseQueryResult<RealEstate[]> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.searchRealEstates, query, limit],
    queryFn: () => searchRealEstates({ query, limit }),
    enabled: query.length >= 3,
  });
};
