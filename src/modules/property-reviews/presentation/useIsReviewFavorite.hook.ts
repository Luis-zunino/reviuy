import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  createIsReviewFavoriteQuery,
  SupabasePropertyReviewReadRepository,
} from '@/modules/property-reviews';

const propertyReviewReadRepository = new SupabasePropertyReviewReadRepository(supabaseClient);
const isReviewFavorite = createIsReviewFavoriteQuery({
  propertyReviewReadRepository,
});

export interface UseIsReviewFavoriteProps {
  reviewId: string;
}
export const useIsReviewFavorite = ({ reviewId }: UseIsReviewFavoriteProps) => {
  return useQuery({
    queryKey: ['isFavoriteReview', reviewId],
    queryFn: () => isReviewFavorite({ reviewId }),
    enabled: !!reviewId,
    staleTime: 0,
  });
};
