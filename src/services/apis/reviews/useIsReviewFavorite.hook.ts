import { useQuery } from '@tanstack/react-query';
import { isReviewFavorite } from './isReviewFavorite.api';

export interface UseIsReviewFavoriteProps {
  reviewId: string;
  userId: string | null;
}
export const useIsReviewFavorite = ({ reviewId, userId }: UseIsReviewFavoriteProps) => {
  return useQuery({
    queryKey: ['isFavoriteReview', reviewId, userId],
    queryFn: () => isReviewFavorite({ reviewId }),
    enabled: !!userId && !!reviewId,
    staleTime: 0,
  });
};
