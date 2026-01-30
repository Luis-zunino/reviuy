'use client';

import { updateReview } from './updateReview.api';
import { useAuthMutation } from '../user';

export const useUpdateReview = () => {
  return useAuthMutation({
    mutationFn: updateReview,
    authErrorMessage: 'Debes iniciar sesión para actualizar reseñas',
    mutationOptions: { mutationKey: ['update-review'] },
  });
};
