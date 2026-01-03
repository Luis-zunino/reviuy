import { supabaseClient } from '@/lib/supabase-client';
import type { IsReviewFavoriteRequest } from './types/isReviewFavorite.types';

export const isReviewFavorite = async ({ reviewId }: IsReviewFavoriteRequest): Promise<boolean> => {
  try {
    const { data, error } = await supabaseClient.rpc('is_review_favorite', {
      p_review_id: reviewId,
    });

    if (error) {
      throw error;
    }

    return data as boolean;
  } catch (error) {
    console.error('Error checking if review is favorite:', error);
    return false;
  }
};
