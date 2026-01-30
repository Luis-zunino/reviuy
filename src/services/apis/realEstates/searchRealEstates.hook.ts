import { REAL_ESTATE_REVIEWS } from '@/services/constants';
import { searchRealEstates } from './searchRealEstates.api';
import { SearchRealEstatesParams } from './types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { RealEstateWitheVotes } from '@/types';

export const useSearchRealEstates = ({
  query,
  limit,
}: SearchRealEstatesParams): UseQueryResult<RealEstateWitheVotes[]> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.searchRealEstates, query, limit],
    queryFn: () => searchRealEstates({ query, limit }),
    enabled: query.length >= 3,
  });
};
