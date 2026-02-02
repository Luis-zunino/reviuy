'use client';

import { deleteRealEstateReviewAction } from '@/app/_actions/real-estate-review.actions';
import { useAuthMutation } from '@/services';

export const useDeleteRealEstateReview = () => {
  return useAuthMutation<
    Awaited<ReturnType<typeof deleteRealEstateReviewAction>>,
    Error,
    { reviewId: string }
  >({
    mutationFn: ({ reviewId }: { reviewId: string }) => deleteRealEstateReviewAction(reviewId),
  });
};
