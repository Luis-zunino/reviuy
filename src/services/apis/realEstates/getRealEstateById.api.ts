import { supabaseClient } from '@/lib/supabase-client';
import { RealEstateWitheVotes } from '@/types/realEstate';
import { parseSupabaseError } from '@/utils';

export const getRealEstateByIdApi = async (id: string): Promise<RealEstateWitheVotes | null> => {
  const { data, error } = await supabaseClient
    .from('real_estates_with_votes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw parseSupabaseError(error);
  return data;
};
