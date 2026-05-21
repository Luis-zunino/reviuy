'use client';

import { REVIEW_KEYS } from '@/constants/query-keys.constant';
import { UUID_REGEX } from '@/constants/uuid-regex.constant';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase/client';
import {
  createGetReviewsByRealEstateIdQuery,
  ReviewWithVotesPublic,
  SupabasePropertyReviewReadRepository,
} from '@/modules/property-reviews';

const propertyReviewReadRepository = new SupabasePropertyReviewReadRepository(supabaseClient);
const getReviewsByRealEstateId = createGetReviewsByRealEstateIdQuery({
  propertyReviewReadRepository,
});

export const useGetReviewsByRealEstateId = (
  realEstateId: string
): UseQueryResult<ReviewWithVotesPublic[] | null> => {
  const isValidRealEstateId = UUID_REGEX.test(realEstateId);

  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewsByRealEstateId, realEstateId],
    queryFn: () => getReviewsByRealEstateId({ realEstateId }),
    enabled: isValidRealEstateId,
  });
};
