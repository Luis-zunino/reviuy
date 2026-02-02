'use client';

import { useAuthMutation } from '../user';
import { createRealEstateReviewAction } from '@/app/_actions/real-estate-review.actions';

export const useCreateRealEstateReviewHook = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para crear una reseña de una inmobiliaria',
    mutationFn: createRealEstateReviewAction,
    mutationOptions: { mutationKey: ['create-real-estate-review'] },
  });
};
