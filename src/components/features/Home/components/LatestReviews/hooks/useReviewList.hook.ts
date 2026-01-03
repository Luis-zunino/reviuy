'use client';

import { useGetLatestReviews } from '@/services';

export const useLatestReviews = () => {
  const { data, isLoading, error, refetch } = useGetLatestReviews();

  return {
    reviewsData: data,
    loading: isLoading,
    error,
    refetch,
  };
};
