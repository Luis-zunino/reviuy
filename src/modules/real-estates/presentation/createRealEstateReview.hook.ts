'use client';

import { useAuthMutation } from '@/shared/auth';
import { createRealEstateReviewAction } from '@/modules/real-estates/presentation';

export const useCreateRealEstateReviewHook = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para crear una reseña de una inmobiliaria',
    mutationFn: createRealEstateReviewAction,
    mutationOptions: { mutationKey: ['create-real-estate-review'] },
  });
};
