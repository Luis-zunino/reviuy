'use client';

import { createReview, CreateReviewRequest } from './createReview.api';
import { useAuthMutation, useVerifyAuthentication } from '../user';

export const useCreateReview = () => {
  const { data } = useVerifyAuthentication();

  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para actualizar reseñas',
    mutationFn: ({ createReviewData }: CreateReviewRequest) =>
      createReview({ createReviewData, userId: data?.userId }),
    mutationOptions: { mutationKey: ['create-review'] },
  });
};
