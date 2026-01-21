'use client';

import { createReview, CreateReviewRequest } from './createReview.api';
import { useAuthMutation, useVerifyAuthentication } from '../user';

export const useCreateReview = () => {
  const { data: auth } = useVerifyAuthentication();

  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para actualizar reseñas',
    mutationFn: ({ data }: CreateReviewRequest) => createReview({ data, userId: auth?.userId }),
    mutationOptions: { mutationKey: ['create-review'] },
  });
};
