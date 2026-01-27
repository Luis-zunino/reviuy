import { supabaseClient } from '@/lib/supabase-client';
import type { ToggleFavoriteReviewRequest, ToggleFavoriteReviewResponse } from './types';
import { parseSupabaseError } from '@/utils';

export const toggleFavoriteReview = async ({
  reviewId,
}: ToggleFavoriteReviewRequest): Promise<ToggleFavoriteReviewResponse> => {
  const { data, error } = await supabaseClient.rpc('toggle_favorite_review', {
    p_review_id: reviewId,
  });

  if (error) throw parseSupabaseError(error);

  return data as unknown as ToggleFavoriteReviewResponse;
};
