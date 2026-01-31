'use client';

import { createReviewAction } from '@/app/_actions/review.actions';
import { useAuthMutation } from '../user';

export const useCreateReview = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para crear reseñas',
    mutationFn: createReviewAction,
    mutationOptions: { mutationKey: ['create-review'] },
  });
};
