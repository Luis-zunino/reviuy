import { supabaseClient } from '@/lib/supabase';
import { VoteType } from '@/types';
import { handleSupabaseError } from '@/lib/errors';

export const getUserRealEstateVote = async ({
  realEstateId,
}: {
  realEstateId: string;
}): Promise<VoteType | null> => {
  const { data, error } = await supabaseClient.rpc('get_user_real_estate_vote', {
    p_real_estate_id: realEstateId,
  });

  if (error) throw handleSupabaseError(error);

  return data as VoteType | null;
};
