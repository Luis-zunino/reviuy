import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReviewWithVotes } from '@/types';
import { parseSupabaseError } from '@/utils';

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

  if (error) throw parseSupabaseError(error);

  return data;
};
