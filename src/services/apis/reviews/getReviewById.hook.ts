'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { reviewMock } from '@/services/mocks/review.mock';
import { reviewData } from '@/services/mocks/reviewData.mock';
import { useQuery } from '@tanstack/react-query';

export const useGetReviewById = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewById, id],
    enabled: true,
    queryFn: () => reviewData.find((review) => review.id === id) ?? reviewMock,
    structuralSharing: false,
  });
};
