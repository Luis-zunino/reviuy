'use client';

import { useAuthMutation } from '../user';
import { updateRealEstateReviewAction } from '@/app/_actions/real-estate-review.actions';
import { UseRealEstateReviewUpdate } from './types';

export const useUpdateRealEstateReviewHook = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para actualizar una reseña de una inmobiliaria',
    mutationFn: ({ id, ...data }: UseRealEstateReviewUpdate) =>
      updateRealEstateReviewAction(id, data),
    mutationOptions: { mutationKey: ['update-real-estate-review'] },
  });
};
