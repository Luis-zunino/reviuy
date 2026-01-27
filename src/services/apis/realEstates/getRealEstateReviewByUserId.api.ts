import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReview } from '@/types';
import { parseSupabaseError } from '@/utils';

export const getRealEstateReviewByUserIdApi = async ({
  userId,
  realEstateId,
}: {
  userId: string;
  realEstateId: string;
}): Promise<RealEstateReview | null> => {
  const { data, error } = await supabaseClient
    .from('real_estate_reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('real_estate_id', realEstateId)
    .maybeSingle();

  if (error) throw parseSupabaseError(error);

  return data;
};
