'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { ReviewWithVotes } from '@/types';
import { handleSupabaseError } from '@/lib/errors';
import { supabaseClient } from '@/lib/supabase';

const getReviewByCurrentUser = async (): Promise<ReviewWithVotes[] | null> => {
  const { data, error } = await supabaseClient.rpc('get_reviews_by_current_user');

  if (error) throw handleSupabaseError(error);
  return data;
};

export const useGetReviewByUserId = (): UseQueryResult<ReviewWithVotes[] | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewByUserId],
    queryFn: () => getReviewByCurrentUser(),
  });
};
