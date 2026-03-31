import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { REVIEW_KEYS } from '@/services/constants';
import { supabaseClient } from '@/lib/supabase';
import {
  ComposedProfileReadRepository,
  createGetCurrentUserReviewsQuery,
} from '@/modules/profiles';
import {
  SupabasePropertyReviewReadRepository,
  type GetReviewsByUserIdOutput,
} from '@/modules/property-reviews';
import { SupabaseRealEstateReadRepository } from '@/modules/real-estates';

const profileReadRepository = new ComposedProfileReadRepository({
  propertyReviewReadRepository: new SupabasePropertyReviewReadRepository(supabaseClient),
  realEstateReadRepository: new SupabaseRealEstateReadRepository(supabaseClient),
});

const getCurrentUserReviews = createGetCurrentUserReviewsQuery({
  profileReadRepository,
});

export const useGetCurrentUserReviews = (): UseQueryResult<GetReviewsByUserIdOutput> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewByUserId],
    queryFn: () => getCurrentUserReviews({}),
  });
};
