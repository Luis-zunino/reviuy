'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ReviewWithRelations } from '@/types';
import type { GetReviewByIdParams } from './types';

const getReviewById = async ({ id }: GetReviewByIdParams): Promise<ReviewWithRelations | null> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*,review_rooms:review_rooms(*),real_estates:real_estates(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
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
