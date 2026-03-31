'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  createGetReviewByIdQuery,
  SupabasePropertyReviewReadRepository,
} from '@/modules/property-reviews';
import { type ReviewPublicWithRelations } from '@/types';
import type { GetReviewByIdParams } from './types';

const propertyReviewReadRepository = new SupabasePropertyReviewReadRepository(supabaseClient);
const getReviewById = createGetReviewByIdQuery({
  propertyReviewReadRepository,
});

export const useGetReviewById = ({
  id,
}: GetReviewByIdParams): UseQueryResult<ReviewPublicWithRelations | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewById, id],
    queryFn: () => getReviewById({ reviewId: id }),
    enabled: !!id,
  });
};
