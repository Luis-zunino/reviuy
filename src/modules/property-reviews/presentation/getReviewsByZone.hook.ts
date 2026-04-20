'use client';

import { REVIEW_KEYS } from '@/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  createGetReviewsByZoneQuery,
  SupabasePropertyReviewReadRepository,
  type GetReviewsByZoneOutput,
} from '@/modules/property-reviews';

const propertyReviewReadRepository = new SupabasePropertyReviewReadRepository(supabaseClient);
const getReviewsByZone = createGetReviewsByZoneQuery({ propertyReviewReadRepository });

interface UseGetReviewsByZoneParams {
  query: string;
  limit?: number;
}

export const useGetReviewsByZone = ({
  query,
  limit,
}: UseGetReviewsByZoneParams): UseQueryResult<GetReviewsByZoneOutput> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewsByZone, query, limit],
    queryFn: () => getReviewsByZone({ query, limit }),
    enabled: query.trim().length >= 3,
  });
};
