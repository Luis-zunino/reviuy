'use client';

import { updateReview } from './updateReview.api';
import { useAuthMutation, useVerifyAuthentication } from '../user';
import { UpdateReviewApiRequest } from './types';

export const useUpdateReview = () => {
  const { data: auth } = useVerifyAuthentication();

  return useAuthMutation({
    mutationFn: ({ reviewId, updateData }: UpdateReviewApiRequest) =>
      updateReview({ reviewId, updateData, userId: auth?.userId ?? '' }),
    authErrorMessage: 'Debes iniciar sesión para actualizar reseñas',
    mutationOptions: { mutationKey: ['update-review'] },
  });
};
