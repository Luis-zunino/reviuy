import { supabaseClient } from '@/lib/supabase-client';
import { VoteType } from '@/types';
import { parseSupabaseError } from '@/utils';

export interface VoteRealEstateParams {
  realEstateId: string;
  voteType: VoteType;
}
export const voteRealEstate = async ({ realEstateId, voteType }: VoteRealEstateParams) => {
  const { data, error } = await supabaseClient.rpc('vote_real_estate', {
    p_real_estate_id: realEstateId,
    p_vote_type: voteType,
  });
  if (error) throw parseSupabaseError(error);
  return data;
};
