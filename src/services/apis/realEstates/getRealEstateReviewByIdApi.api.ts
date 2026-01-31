import { supabaseClient } from '@/lib/supabase';
import type { RealEstateReviewWithVotes } from '@/types';
import { handleSupabaseError } from '@/lib/errors';

export interface GetRealEstateReviewByIdApiProps {
  reviewId: string;
}
export const getRealEstateReviewByIdApi = async ({
  reviewId,
}: GetRealEstateReviewByIdApiProps): Promise<RealEstateReviewWithVotes | null> => {
  const { data, error } = await supabaseClient
    .from('real_estate_reviews_with_votes')
    .select('*')
    .eq('id', reviewId)
    .order('created_at', { ascending: false })
    .maybeSingle();
  if (error) throw handleSupabaseError(error);

  return data;
};
