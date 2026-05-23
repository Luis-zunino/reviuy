import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';
import { supabaseClient } from '@/lib/supabase/client';
import {
  createGetRealEstateReviewByUserIdQuery,
  RealEstateReviewWithVotesPublic,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const getRealEstateReviewByUserId = createGetRealEstateReviewByUserIdQuery({ repository });

export const useGetRealEstateReviewByUserId = ({
  realEstateId,
}: {
  realEstateId: string;
}): UseQueryResult<RealEstateReviewWithVotesPublic | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getRealEstateReviewByUserId, realEstateId],
    queryFn: () => getRealEstateReviewByUserId({ realEstateId }),
    enabled: Boolean(realEstateId),
  });
};
