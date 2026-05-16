import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { REAL_ESTATE_REVIEWS } from '@/constants';
import { supabaseClient } from '@/lib/supabase';
import {
  createGetRealEstateByIdQuery,
  SupabaseRealEstateReadRepository,
  RealEstateWithVotesPublic,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const getRealEstateById = createGetRealEstateByIdQuery({ repository });

export const useGetRealEstateById = (id: string): UseQueryResult<RealEstateWithVotesPublic | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getRealEstateById, id],
    queryFn: () => getRealEstateById({ id }),
    enabled: !!id,
  });
};
