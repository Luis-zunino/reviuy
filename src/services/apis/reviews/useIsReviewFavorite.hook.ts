import { useQuery } from '@tanstack/react-query';
import { isReviewFavorite } from './isReviewFavorite.api';
import { User } from '@supabase/supabase-js';

export interface UseIsReviewFavoriteProps {
  reviewId: string;
  user: User | null;
}
export const useIsReviewFavorite = ({ reviewId, user }: UseIsReviewFavoriteProps) => {
  return useQuery({
    queryKey: ['isFavoriteReview', reviewId, user?.id],
    queryFn: () => isReviewFavorite({ reviewId }),
    enabled: !!user && !!reviewId,
    staleTime: 0,
  });
};
