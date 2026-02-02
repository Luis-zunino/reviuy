'use client';

import { deleteReviewAction } from '@/app/_actions/review.actions';

import { useAuthMutation } from '../user';

export const useDeleteReview = () => {
  return useAuthMutation({
    mutationFn: ({ reviewId }: { reviewId: string }) => deleteReviewAction(reviewId),
  });
};
