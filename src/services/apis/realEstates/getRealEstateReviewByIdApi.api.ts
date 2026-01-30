import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReviewWithVotes } from '@/types';
import { parseSupabaseError } from '@/utils';

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
  if (error) throw parseSupabaseError(error);

  return data;
};
