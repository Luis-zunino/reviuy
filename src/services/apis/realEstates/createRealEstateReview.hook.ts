'use client';

import { RealEstateReviewInsert } from '@/types';
import { useAuthMutation, useVerifyAuthentication } from '../user';
import { createRealEstateReview } from './createRealEstateReview.api';

export const useCreateRealEstateReviewHook = () => {
  const { data } = useVerifyAuthentication();

  return useAuthMutation({
    authErrorMessage: 'Debes iniciar sesión para crear una reseña de una inmobiliaria',
    mutationFn: (createRealEstateReviewData: RealEstateReviewInsert) =>
      createRealEstateReview({ createRealEstateReviewData, user: data?.user }),
    mutationOptions: { mutationKey: ['create-real-estate-review'] },
  });
};
