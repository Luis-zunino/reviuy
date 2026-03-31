import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import type { RealEstateReviewWithVotesPublic } from '@/types';
import { REAL_ESTATE_REVIEWS } from '@/services/constants';
import { GetAllRealEstateReviews } from './types';
import {
  createGetAllRealEstateReviewsQuery,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const getAllRealEstateReviews = createGetAllRealEstateReviewsQuery({ repository });

export const useGetAllRealEstateReviews = ({
  id,
  limit,
}: GetAllRealEstateReviews): UseQueryResult<RealEstateReviewWithVotesPublic[] | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getAllRealEstateReviews, limit],
    queryFn: () => getAllRealEstateReviews({ id, limit }),
  });
};
