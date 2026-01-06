'use client';

import { createReview, CreateReviewRequest } from './createReview.api';
import { useAuthMutation, useVerifyAuthentication } from '../user';

export const useCreateReview = () => {
  const { data } = useVerifyAuthentication();

  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para actualizar reseñas',
    mutationFn: ({ createReviewData }: CreateReviewRequest) =>
      createReview({ createReviewData, user: data?.user }),
    mutationOptions: { mutationKey: ['create-review'] },
  });
};
