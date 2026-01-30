'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ReviewWithRelations } from '@/types';
import type { GetReviewByIdParams } from './types';
import { parseSupabaseError } from '@/utils';

const getReviewById = async ({ id }: GetReviewByIdParams): Promise<ReviewWithRelations | null> => {
  const { data, error } = await supabase
    .from('reviews_with_votes')
    .select('*,review_rooms:review_rooms(*),real_estates:real_estates_with_votes(*)')
    .eq('id', id)
    .single();

  if (error) throw parseSupabaseError(error);
  return data;
};

export const useGetReviewById = ({
  id,
}: GetReviewByIdParams): UseQueryResult<ReviewWithRelations | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewById, id],
    queryFn: () => getReviewById({ id }),
    enabled: !!id,
  });
};
