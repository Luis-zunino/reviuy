import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import { REAL_ESTATE_REVIEWS } from '@/constants';
import { GetAllRealEstateReviews } from './types';
import {
  createGetAllRealEstateReviewsQuery,
  RealEstateReviewWithVotesPublic,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const getAllRealEstateReviews = createGetAllRealEstateReviewsQuery({ repository });

export const useGetAllRealEstateReviews = (
  props: GetAllRealEstateReviews
): UseQueryResult<RealEstateReviewWithVotesPublic[] | null> => {
  const { id, limit } = props;
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getAllRealEstateReviews, limit],
    queryFn: () => getAllRealEstateReviews({ id, limit }),
  });
};
