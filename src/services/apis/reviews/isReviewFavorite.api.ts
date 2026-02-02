import { supabaseClient } from '@/lib/supabase';
import type { IsReviewFavoriteRequest } from './types/isReviewFavorite.types';
import { handleSupabaseError } from '@/lib/errors';

export const isReviewFavorite = async ({ reviewId }: IsReviewFavoriteRequest): Promise<boolean> => {
  const { data, error } = await supabaseClient.rpc('is_review_favorite', {
    p_review_id: reviewId,
  });

  if (error) throw handleSupabaseError(error);

  return data;
};
