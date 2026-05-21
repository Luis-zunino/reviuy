'use client';

import { deleteReviewAction } from '@/modules/property-reviews/presentation';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

export const useDeleteReview = () => {
  return useAuthMutation({
    mutationFn: async ({ reviewId }: { reviewId: string }) => await deleteReviewAction(reviewId),
    invalidateQueryKeys: [
      [REVIEW_KEYS.getReviewsByAddress],
      [REVIEW_KEYS.getReviewsByZone],
      [REVIEW_KEYS.getReviewsNearby],
      [REVIEW_KEYS.getReviewsByRealEstateId],
      [REVIEW_KEYS.getReviewByUserId],
      [REVIEW_KEYS.getLatestReviews],
      [REVIEW_KEYS.checkUserReviewForAddress],
    ],
  });
};
