'use client';

import { REVIEW_KEYS } from '@/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  createGetReviewsNearbyQuery,
  SupabasePropertyReviewReadRepository,
  type GetReviewsNearbyOutput,
} from '@/modules/property-reviews';

const propertyReviewReadRepository = new SupabasePropertyReviewReadRepository(supabaseClient);
const getReviewsNearby = createGetReviewsNearbyQuery({ propertyReviewReadRepository });

interface UseGetReviewsNearbyParams {
  lat: number | null;
  lon: number | null;
  radiusDeg?: number;
  limit?: number;
}

export const useGetReviewsNearby = ({
  lat,
  lon,
  radiusDeg,
  limit,
}: UseGetReviewsNearbyParams): UseQueryResult<GetReviewsNearbyOutput> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewsNearby, lat, lon, radiusDeg, limit],
    enabled: lat !== null && lon !== null,
    queryFn: () => getReviewsNearby({ lat: lat!, lon: lon!, radiusDeg, limit }),
  });
};
