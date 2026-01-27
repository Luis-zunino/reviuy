import { supabaseClient } from '@/lib/supabase-client';
import { VoteType } from '@/types';
import { parseSupabaseError } from '@/utils';

export const voteRealEstate = async ({
  realEstateId,
  voteType,
}: {
  realEstateId: string;
  voteType: VoteType;
}) => {
  const { data, error } = await supabaseClient.rpc('vote_real_estate', {
    p_real_estate_id: realEstateId,
    p_vote_type: voteType,
  });
  if (error) throw parseSupabaseError(error);
  return data;
};
