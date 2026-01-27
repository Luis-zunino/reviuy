import { supabaseClient } from '@/lib/supabase-client';
import { VoteType } from '@/types';
import { parseSupabaseError } from '@/utils';

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

  if (error) throw parseSupabaseError(error);

  return data?.vote_type as VoteType | null;
};
