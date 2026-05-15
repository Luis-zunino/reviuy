'use client';

import { updateReviewAction } from '@/modules/property-reviews/presentation';
import { useAuthMutation } from '@/shared/auth';

export const useUpdateReview = () => {
  return useAuthMutation({
    mutationFn: ({
      reviewId,
      updateData,
    }: {
      reviewId: string;
      updateData: Parameters<typeof updateReviewAction>[1];
    }) => updateReviewAction(reviewId, updateData),
    authErrorMessage: 'Debes iniciar sesión para actualizar reseñas',
    mutationOptions: { mutationKey: ['update-review'] },
  });
};
