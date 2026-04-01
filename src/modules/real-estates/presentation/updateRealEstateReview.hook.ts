'use client';

import { useAuthMutation } from '@/shared/auth';
import { updateRealEstateReviewAction } from '@/modules/real-estates/presentation';
import { UseRealEstateReviewUpdate } from './types';

export const useUpdateRealEstateReviewHook = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para actualizar una reseña de una inmobiliaria',
    mutationFn: ({ id, ...data }: UseRealEstateReviewUpdate) =>
      updateRealEstateReviewAction(id, data),
    mutationOptions: { mutationKey: ['update-real-estate-review'] },
  });
};
