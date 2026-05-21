import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';
import { supabaseClient } from '@/lib/supabase/client';
import {
  createGetRealEstateReviewByIdQuery,
  RealEstateReviewWithVotesPublic,
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
