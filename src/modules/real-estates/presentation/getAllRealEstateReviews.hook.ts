import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase/client';
import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';
import { UUID_REGEX } from '@/constants/uuid-regex.constant';
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
  const isValidRealEstateId = UUID_REGEX.test(id);

  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getAllRealEstateReviews, id, limit],
    queryFn: () => getAllRealEstateReviews({ id, limit }),
    enabled: isValidRealEstateId,
  });
};
