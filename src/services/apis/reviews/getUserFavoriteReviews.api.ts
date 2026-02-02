import { supabaseClient } from '@/lib/supabase';
import type { ReviewWithVotes } from '@/types';
import { handleSupabaseError } from '@/lib/errors';

export const getUserFavoriteReviews = async (): Promise<ReviewWithVotes[]> => {
  const { data, error } = await supabaseClient.rpc('get_favorite_reviews_by_current_user');

  if (error) throw handleSupabaseError(error);
  return data ?? [];
};
