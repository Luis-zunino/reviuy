'use client';

import { uploadReviewImageAction } from './review-images.actions';
import { useAuthMutation } from '@/shared/auth';

interface UploadReviewImageVariables {
  reviewId: string;
  osmId: string;
  file: File;
}

export const useUploadReviewImage = () => {
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para subir imágenes',
    mutationFn: async ({ reviewId, osmId, file }: UploadReviewImageVariables) => {
      const formData = new FormData();
      formData.append('file', file);

      return uploadReviewImageAction(reviewId, osmId, formData);
    },
    mutationOptions: { mutationKey: ['upload-review-image'] },
  });
};
