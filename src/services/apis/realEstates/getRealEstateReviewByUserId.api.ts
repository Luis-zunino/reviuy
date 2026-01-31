import { supabaseClient } from '@/lib/supabase';
import type { RealEstateReviewWithVotes } from '@/types';
import { handleSupabaseError } from '@/lib/errors';

export const getRealEstateReviewByUserIdApi = async ({
  userId,
  realEstateId,
}: {
  userId: string;
  realEstateId: string;
}): Promise<RealEstateReviewWithVotes | null> => {
  const { data, error } = await supabaseClient
    .from('real_estate_reviews_with_votes')
    .select('*')
    .eq('user_id', userId)
    .eq('real_estate_id', realEstateId)
    .maybeSingle();

  if (error) throw handleSupabaseError(error);

  return data;
};
