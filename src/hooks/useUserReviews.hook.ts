'use client';

import { useGetReviewByUserId } from '@/services';

export const useUserReviews = () => {
  const { data: reviews, error, isLoading, refetch } = useGetReviewByUserId();

  return {
    reviews,
    loading: isLoading,
    error,
    refetch,
  };
};
