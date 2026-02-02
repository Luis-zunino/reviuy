import { supabaseClient } from '@/lib/supabase';
import type { RealEstateReviewWithVotes } from '@/types';
import { handleSupabaseError } from '@/lib/errors';

export const getRealEstateReviewByUserIdApi = async ({
  realEstateId,
}: {
  realEstateId: string;
}): Promise<RealEstateReviewWithVotes | null> => {
  const { data, error } = await supabaseClient.rpc('get_real_estate_review_by_user', {
    p_real_estate_id: realEstateId,
  });

  if (error) throw handleSupabaseError(error);

  // RPC devuelve array
  return data?.[0] ?? null;
};
