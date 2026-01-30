'use client';

import { createReview } from './createReview.api';
import { useAuthMutation } from '../user';

export const useCreateReview = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para actualizar reseñas',
    mutationFn: createReview,
    mutationOptions: { mutationKey: ['create-review'] },
  });
};
