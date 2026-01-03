'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Review } from '@/types';

const getLatestReviews = async (): Promise<Review[] | null> => {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(10);

  return data;
};

export const useGetLatestReviews = (): UseQueryResult<Review[] | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getLatestReviews],
    enabled: true,
    queryFn: getLatestReviews,
  });
};
