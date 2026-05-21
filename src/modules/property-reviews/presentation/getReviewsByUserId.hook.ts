'use client';

import { REVIEW_KEYS } from '@/constants/query-keys.constant';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase/client';
import {
  createGetReviewsByUserIdQuery,
  ReviewWithVotes,
  SupabasePropertyReviewReadRepository,
} from '@/modules/property-reviews';

const propertyReviewReadRepository = new SupabasePropertyReviewReadRepository(supabaseClient);
const getReviewByCurrentUser = createGetReviewsByUserIdQuery({
  propertyReviewReadRepository,
});

export const useGetReviewByUserId = (): UseQueryResult<ReviewWithVotes[] | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewByUserId],
    queryFn: () => getReviewByCurrentUser(),
  });
};
