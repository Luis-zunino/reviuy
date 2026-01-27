import { supabaseClient } from '@/lib/supabase-client';
import type { IsReviewFavoriteRequest } from './types/isReviewFavorite.types';
import { parseSupabaseError } from '@/utils';

export const isReviewFavorite = async ({ reviewId }: IsReviewFavoriteRequest): Promise<boolean> => {
  const { data, error } = await supabaseClient.rpc('is_review_favorite', {
    p_review_id: reviewId,
  });

  if (error) throw parseSupabaseError(error);

  return data;
};
