'use client';

import { deleteRealEstateReview } from './deleteRealEstateReview.api';
import { useAuthMutation } from '@/services';

export const useDeleteRealEstateReview = () => {
  return useAuthMutation<
    Awaited<ReturnType<typeof deleteRealEstateReview>>,
    Error,
    { reviewId?: string }
  >({
    mutationFn: deleteRealEstateReview,
  });
};
