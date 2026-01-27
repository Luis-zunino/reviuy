import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReview } from '@/types';
import { parseSupabaseError } from '@/utils';

export const getRealEstateReviewByIdApi = async ({
  reviewId,
}: {
  reviewId: string;
}): Promise<RealEstateReview | null> => {
  const { data, error } = await supabaseClient
    .from('real_estate_reviews')
    .select('*')
    .eq('id', reviewId)
    .order('created_at', { ascending: false })
    .maybeSingle();

  if (error) throw parseSupabaseError(error);

  return data;
};
