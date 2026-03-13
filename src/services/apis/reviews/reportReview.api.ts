import { supabaseClient } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/errors';

export const hasUserReportedReview = async (reviewId: string): Promise<boolean> => {
  const { data, error } = await supabaseClient.rpc('has_user_reported_review', {
    p_review_id: reviewId,
  });

  if (error) throw handleSupabaseError(error);

  return data;
};
