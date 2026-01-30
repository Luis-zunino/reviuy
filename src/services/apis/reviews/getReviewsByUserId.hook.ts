'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { ReviewWithVotes } from '@/types';
import { parseSupabaseError } from '@/utils';
import { supabaseClient } from '@/lib/supabase-client';
import { useVerifyAuthentication } from '../user';

export interface GetReviewByUserIdParams {
  userId?: string | null;
}

const getReviewByUserId = async ({
  userId,
}: GetReviewByUserIdParams): Promise<ReviewWithVotes[] | null> => {
  const { data, error: fetchError } = await supabaseClient
    .from('reviews_with_votes')
    .select('*')
    .eq('user_id', userId ?? '')
    .order('created_at', { ascending: false });

  if (fetchError) throw parseSupabaseError(fetchError);
  return data;
};

export const useGetReviewByUserId = (): UseQueryResult<ReviewWithVotes[] | null> => {
  const { data } = useVerifyAuthentication();
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewByUserId, data?.userId],
    queryFn: () => getReviewByUserId({ userId: data?.userId }),
    enabled: !!data?.userId,
  });
};
