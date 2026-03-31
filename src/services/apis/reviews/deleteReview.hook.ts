'use client';

import { deleteReviewAction } from '@/app/_actions/review.actions';
import { useAuthMutation } from '../user';

export const useDeleteReview = () => {
  return useAuthMutation({
    mutationFn: async ({ reviewId }: { reviewId: string }) => await deleteReviewAction(reviewId),
  });
};
