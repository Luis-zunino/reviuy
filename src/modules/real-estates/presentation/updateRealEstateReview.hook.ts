'use client';

import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { updateRealEstateReviewAction } from '@/modules/real-estates/presentation';
import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';
import { UseRealEstateReviewUpdate } from './types';

export const useUpdateRealEstateReviewHook = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para actualizar una reseña de una inmobiliaria',
    mutationFn: ({ id, ...data }: UseRealEstateReviewUpdate) =>
      updateRealEstateReviewAction(id, data),
    invalidateQueryKeys: [
      [REAL_ESTATE_REVIEWS.getRealEstateReviewById],
      [REAL_ESTATE_REVIEWS.getAllRealEstateReviews],
      [REAL_ESTATE_REVIEWS.getRealEstateById],
    ],
    mutationOptions: { mutationKey: ['update-real-estate-review'] },
  });
};
