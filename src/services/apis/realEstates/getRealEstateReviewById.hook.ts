import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { RealEstateReviewWithVotesPublic } from '@/types';
import { REAL_ESTATE_REVIEWS } from '@/services/constants';
import { supabaseClient } from '@/lib/supabase';
import {
  createGetRealEstateReviewByIdQuery,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const getRealEstateReviewById = createGetRealEstateReviewByIdQuery({ repository });

export const useGetRealEstateReviewById = ({
  reviewId,
}: {
  reviewId: string;
}): UseQueryResult<RealEstateReviewWithVotesPublic | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getRealEstateReviewById],
    queryFn: () => getRealEstateReviewById({ reviewId }),
  });
};
