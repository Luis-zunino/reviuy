import { supabaseClient } from '@/lib/supabase-client';
import { VoteType } from '@/types';

export const getUserRealEstateVote = async ({
  realEstateId,
  userId,
}: {
  realEstateId: string;
  userId: string;
}): Promise<VoteType | null> => {
  if (!userId) return null;

  const { data, error } = await supabaseClient
    .from('real_estate_votes')
    .select('vote_type')
    .eq('real_estate_id', realEstateId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data?.vote_type as VoteType | null;
};
