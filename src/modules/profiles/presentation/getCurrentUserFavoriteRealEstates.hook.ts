import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  ComposedProfileReadRepository,
  createGetCurrentUserFavoriteRealEstatesQuery,
} from '@/modules/profiles';
import {
  SupabaseRealEstateReadRepository,
  type GetUserFavoriteRealEstatesOutput,
} from '@/modules/real-estates';
import { SupabasePropertyReviewReadRepository } from '@/modules/property-reviews';

const profileReadRepository = new ComposedProfileReadRepository({
  propertyReviewReadRepository: new SupabasePropertyReviewReadRepository(supabaseClient),
  realEstateReadRepository: new SupabaseRealEstateReadRepository(supabaseClient),
});

const getCurrentUserFavoriteRealEstates = createGetCurrentUserFavoriteRealEstatesQuery({
  profileReadRepository,
});

export const useGetCurrentUserFavoriteRealEstates =
  (): UseQueryResult<GetUserFavoriteRealEstatesOutput> => {
    return useQuery({
      queryKey: ['favoriteRealEstates'],
      queryFn: () => getCurrentUserFavoriteRealEstates({}),
    });
  };
