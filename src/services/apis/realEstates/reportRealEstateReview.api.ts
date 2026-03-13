import { supabaseClient } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/errors';

export const hasUserReportedRealEstateReview = async (reviewId: string): Promise<boolean> => {
  const { data, error } = await supabaseClient.rpc('has_user_reported_real_estate_review', {
    p_review_id: reviewId,
  });

  if (error) throw handleSupabaseError(error);

  return data;
};
