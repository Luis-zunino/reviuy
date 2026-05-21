'use client';

import { deleteRealEstateReviewAction } from '@/modules/real-estates/presentation';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';

export const useDeleteRealEstateReview = () => {
  return useAuthMutation<
    Awaited<ReturnType<typeof deleteRealEstateReviewAction>>,
    Error,
    { reviewId: string }
  >({
    mutationFn: ({ reviewId }: { reviewId: string }) => deleteRealEstateReviewAction(reviewId),
  });
};
