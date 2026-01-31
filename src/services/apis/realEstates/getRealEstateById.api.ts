import { supabaseClient } from '@/lib/supabase';
import { RealEstateWitheVotes } from '@/types/real-estate';
import { handleSupabaseError } from '@/lib/errors';

export const getRealEstateByIdApi = async (id: string): Promise<RealEstateWitheVotes | null> => {
  const { data, error } = await supabaseClient
    .from('real_estates_with_votes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw handleSupabaseError(error);
  return data;
};
