import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  ComposedProfileReadRepository,
  createGetCurrentUserFavoriteReviewsQuery,
} from '@/modules/profiles';
import {
  SupabasePropertyReviewReadRepository,
  type GetUserFavoriteReviewsOutput,
} from '@/modules/property-reviews';
import { SupabaseRealEstateReadRepository } from '@/modules/real-estates';

const profileReadRepository = new ComposedProfileReadRepository({
  propertyReviewReadRepository: new SupabasePropertyReviewReadRepository(supabaseClient),
  realEstateReadRepository: new SupabaseRealEstateReadRepository(supabaseClient),
});

const getCurrentUserFavoriteReviews = createGetCurrentUserFavoriteReviewsQuery({
  profileReadRepository,
});

export const useGetCurrentUserFavoriteReviews =
  (): UseQueryResult<GetUserFavoriteReviewsOutput> => {
    return useQuery({
      queryKey: ['favoriteReviews'],
      queryFn: () => getCurrentUserFavoriteReviews({}),
    });
  };
