'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { reviewData } from '@/services/mocks/reviewData.mock';
import { useQuery } from '@tanstack/react-query';

export const useGetLatestReviews = () => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getLatestReviews],
    enabled: true,
    queryFn: () => {
      return reviewData;
    },
  });
};
