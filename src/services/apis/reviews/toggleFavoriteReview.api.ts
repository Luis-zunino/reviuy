import { supabaseClient } from '@/lib/supabase-client';
import type { ToggleFavoriteReviewRequest, ToggleFavoriteReviewResponse } from './types';

export const toggleFavoriteReview = async ({
  reviewId,
}: ToggleFavoriteReviewRequest): Promise<ToggleFavoriteReviewResponse> => {
  try {
    const { data, error } = await supabaseClient.rpc('toggle_favorite_review', {
      p_review_id: reviewId,
    });

    if (error) {
      throw error;
    }

    return data as unknown as ToggleFavoriteReviewResponse;
  } catch (error) {
    console.error('Error toggling favorite review:', error);
    throw error;
  }
};
