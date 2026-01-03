import { useQuery } from '@tanstack/react-query';
import { isReviewFavorite } from './isReviewFavorite.api';
import { useAuth } from '@/hooks';

export const useIsReviewFavorite = (reviewId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['isFavoriteReview', reviewId, user?.id],
    queryFn: () => isReviewFavorite({ reviewId }),
    enabled: !!user && !!reviewId,
    staleTime: 0,
  });
};
