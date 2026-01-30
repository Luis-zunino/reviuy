'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { ReviewWithVotes } from '@/types';
import { getReviewsByRealEstateIdApi } from './getReviewsByRealEstateId.api';

export const useGetReviewsByRealEstateId = (
  realEstateId: string
): UseQueryResult<ReviewWithVotes[] | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewsByRealEstateId, realEstateId],
    queryFn: () => getReviewsByRealEstateIdApi(realEstateId),
    enabled: !!realEstateId,
  });
};
