'use client';

import { useGetLatestReviews } from '@/services';

export const useLatestReviews = () => {
  const { data, isLoading, error } = useGetLatestReviews();
  const addVote = ({ id, voteType }: { id: number; voteType: string }) => {
    console.log('addVote', { id, voteType });
  };

  return {
    reviewsData: data,
    loading: isLoading,
    error,
    addVote,
  };
};
