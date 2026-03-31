import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { RealEstateWitheVotes } from '@/types';
import { REAL_ESTATE_REVIEWS } from '@/services/constants';
import { supabaseClient } from '@/lib/supabase';
import {
  createGetRealEstateByIdQuery,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const getRealEstateById = createGetRealEstateByIdQuery({ repository });

export const useGetRealEstateById = (id: string): UseQueryResult<RealEstateWitheVotes | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getRealEstateById, id],
    queryFn: () => getRealEstateById({ id }),
    enabled: !!id,
  });
};
