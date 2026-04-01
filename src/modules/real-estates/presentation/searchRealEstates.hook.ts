import { REAL_ESTATE_REVIEWS } from '@/constants';
import { SearchRealEstatesParams } from './types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  createSearchRealEstatesQuery,
  RealEstateWitheVotes,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const searchRealEstates = createSearchRealEstatesQuery({ repository });

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
