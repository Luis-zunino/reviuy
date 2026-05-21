'use client';

import { updateReviewAction } from '@/modules/property-reviews/presentation';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

export const useUpdateReview = () => {
  return useAuthMutation({
    mutationFn: ({
      reviewId,
      updateData,
    }: {
      reviewId: string;
      updateData: Parameters<typeof updateReviewAction>[1];
    }) => updateReviewAction(reviewId, updateData),
    authErrorMessage: 'Debes iniciar sesión para actualizar reseñas',
    invalidateQueryKeys: [
      [REVIEW_KEYS.getReviewById],
      [REVIEW_KEYS.getReviewsByAddress],
      [REVIEW_KEYS.getReviewsByZone],
      [REVIEW_KEYS.getReviewsNearby],
      [REVIEW_KEYS.getReviewsByRealEstateId],
      [REVIEW_KEYS.getReviewByUserId],
      [REVIEW_KEYS.getLatestReviews],
    ],
    mutationOptions: { mutationKey: ['update-review'] },
  });
};
