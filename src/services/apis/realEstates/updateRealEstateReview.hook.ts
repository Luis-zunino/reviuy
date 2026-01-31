'use client';

import { useAuthMutation } from '../user';
import { updateRealEstateReviewAction } from '@/app/_actions/real-estate-review.actions';

export const useUpdateRealEstateReviewHook = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para actualizar una reseña de una inmobiliaria',
    mutationFn: ({ id, ...data }: any) => updateRealEstateReviewAction(id, data),
    mutationOptions: { mutationKey: ['update-real-estate-review'] },
  });
};
