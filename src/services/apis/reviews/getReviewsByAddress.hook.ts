'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  createGetReviewsByAddressQuery,
  SupabasePropertyReviewReadRepository,
} from '@/modules/property-reviews';
import type { ReviewWithVotesPublic } from '@/types';
import type { GetReviewsByAddressParams } from './types';

const propertyReviewReadRepository = new SupabasePropertyReviewReadRepository(supabaseClient);
const getReviewsByAddress = createGetReviewsByAddressQuery({
  propertyReviewReadRepository,
});

export const useGetReviewsByAddress = ({
  osmId,
}: GetReviewsByAddressParams): UseQueryResult<ReviewWithVotesPublic[] | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewsByAddress, osmId],
    queryFn: () => getReviewsByAddress({ osmId }),
    enabled: !!osmId,
  });
};
