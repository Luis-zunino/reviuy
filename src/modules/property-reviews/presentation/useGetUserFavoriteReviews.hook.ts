import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  createGetUserFavoriteReviewsQuery,
  SupabasePropertyReviewReadRepository,
} from '@/modules/property-reviews';

const propertyReviewReadRepository = new SupabasePropertyReviewReadRepository(supabaseClient);
const getUserFavoriteReviews = createGetUserFavoriteReviewsQuery({
  propertyReviewReadRepository,
});

export const useGetUserFavoriteReviews = () => {
  return useQuery({
    queryKey: ['favoriteReviews'],
    queryFn: () => getUserFavoriteReviews(),
  });
};
