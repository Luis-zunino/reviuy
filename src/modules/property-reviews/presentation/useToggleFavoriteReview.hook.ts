import { toggleFavoriteReviewAction } from '@/modules/property-reviews/presentation';
import { useToggleFavorite } from '@/shared/api';

export const useToggleFavoriteReview = () =>
  useToggleFavorite<{ reviewId: string }>(
    ({ reviewId }) => toggleFavoriteReviewAction(reviewId),
    [['reviews'], ['favoriteReviews'], ['isFavoriteReview']]
  );
