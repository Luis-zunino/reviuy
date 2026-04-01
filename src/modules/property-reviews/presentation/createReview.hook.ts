'use client';

import { createReviewAction } from '@/modules/property-reviews/presentation';
import { useAuthMutation } from '@/shared/auth';

export const useCreateReview = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para crear reseñas',
    mutationFn: createReviewAction,
    mutationOptions: { mutationKey: ['create-review'] },
  });
};
