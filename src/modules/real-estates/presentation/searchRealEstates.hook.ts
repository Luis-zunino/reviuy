import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';
import { SearchRealEstatesParams } from './types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase/client';
import {
  createSearchRealEstatesQuery,
  RealEstateWithVotesPublic,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const searchRealEstates = createSearchRealEstatesQuery({ repository });

export const useSearchRealEstates = ({
  query,
  limit,
}: SearchRealEstatesParams): UseQueryResult<RealEstateWithVotesPublic[]> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.searchRealEstates, query, limit],
    queryFn: () => searchRealEstates({ query, limit }),
    enabled: query.length >= 3,
  });
};
