import { useQuery } from '@tanstack/react-query';
import { isReviewFavorite } from './isReviewFavorite.api';

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
