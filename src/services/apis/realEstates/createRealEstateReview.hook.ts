'use client';

import { useAuthMutation } from '../user';
import { createRealEstateReview } from './createRealEstateReview.api';

export const useCreateRealEstateReviewHook = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para crear una reseña de una inmobiliaria',
    mutationFn: createRealEstateReview,
    mutationOptions: { mutationKey: ['create-real-estate-review'] },
  });
};
