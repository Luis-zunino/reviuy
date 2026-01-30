'use client';

import { useAuthMutation } from '../user';
import { updateRealEstateReview } from './updateRealEstateReview.api';

export const useUpdateRealEstateReviewHook = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para actualizar una reseña de una inmobiliaria',
    mutationFn: updateRealEstateReview,
    mutationOptions: { mutationKey: ['update-real-estate-review'] },
  });
};
