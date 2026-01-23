'use client';

import { createReview } from './createReview.api';
import { useAuthMutation, useVerifyAuthentication } from '../user';
import { CreateReviewRequest } from './types';

export const useCreateReview = () => {
  const { data: auth } = useVerifyAuthentication();

  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para actualizar reseñas',
    mutationFn: ({ data }: CreateReviewRequest) => createReview({ data, userId: auth?.userId }),
    mutationOptions: { mutationKey: ['create-review'] },
  });
};
