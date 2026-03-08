import { supabaseClient } from '@/lib/supabase';
import type { RealEstateReviewWithVotesPublic } from '@/types';
import { handleSupabaseError } from '@/lib/errors';

export interface GetRealEstateReviewByIdApiProps {
  reviewId: string;
}
export const getRealEstateReviewByIdApi = async ({
  reviewId,
}: GetRealEstateReviewByIdApiProps): Promise<RealEstateReviewWithVotesPublic | null> => {
  const { data, error } = await supabaseClient
    .from('real_estate_reviews_with_votes_public')
    .select('*')
    .eq('id', reviewId)
    .order('created_at', { ascending: false })
    .maybeSingle();
  if (error) throw handleSupabaseError(error);

  return data;
};
