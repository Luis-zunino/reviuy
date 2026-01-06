'use client';

import { RealEstateReviewUpdate } from '@/types';
import { useAuthMutation, useVerifyAuthentication } from '../user';
import { updateRealEstateReview } from './updateRealEstateReview.api';

export const useUpdateRealEstateReviewHook = () => {
  const { data } = useVerifyAuthentication();
  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para actualizar una reseña de una inmobiliaria',
    mutationFn: (updateRealEstateReviewData: RealEstateReviewUpdate) =>
      updateRealEstateReview(updateRealEstateReviewData, data?.user),
    mutationOptions: { mutationKey: ['update-real-estate-review'] },
  });
};
