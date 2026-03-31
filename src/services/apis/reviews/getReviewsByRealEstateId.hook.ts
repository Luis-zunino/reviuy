'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  createGetReviewsByRealEstateIdQuery,
  SupabasePropertyReviewReadRepository,
} from '@/modules/property-reviews';
import type { ReviewWithVotesPublic } from '@/types';

const propertyReviewReadRepository = new SupabasePropertyReviewReadRepository(supabaseClient);
const getReviewsByRealEstateId = createGetReviewsByRealEstateIdQuery({
  propertyReviewReadRepository,
});

export const useGetReviewsByRealEstateId = (
  realEstateId: string
): UseQueryResult<ReviewWithVotesPublic[] | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewsByRealEstateId, realEstateId],
    queryFn: () => getReviewsByRealEstateId({ realEstateId }),
    enabled: !!realEstateId,
  });
};
