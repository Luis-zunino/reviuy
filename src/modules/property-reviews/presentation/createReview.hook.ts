'use client';

import { createReviewAction } from '@/modules/property-reviews/presentation';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

export const useCreateReview = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para crear reseñas',
    mutationFn: createReviewAction,
    invalidateQueryKeys: [
      [REVIEW_KEYS.getReviewsByAddress],
      [REVIEW_KEYS.getReviewsByZone],
      [REVIEW_KEYS.getReviewsNearby],
      [REVIEW_KEYS.getReviewsByRealEstateId],
      [REVIEW_KEYS.getReviewByUserId],
      [REVIEW_KEYS.getLatestReviews],
      [REVIEW_KEYS.checkUserReviewForAddress],
    ],
    mutationOptions: { mutationKey: ['create-review'] },
  });
};
