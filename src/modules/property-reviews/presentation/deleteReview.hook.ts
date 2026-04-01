'use client';

import { deleteReviewAction } from '@/modules/property-reviews/presentation';
import { useAuthMutation } from '@/shared/auth';

export const useDeleteReview = () => {
  return useAuthMutation({
    mutationFn: async ({ reviewId }: { reviewId: string }) => await deleteReviewAction(reviewId),
  });
};
