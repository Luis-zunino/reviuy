import { supabaseClient } from '@/lib/supabase-client';
import { RealEstate } from '@/types/realEstate';
import { parseSupabaseError } from '@/utils';

export const getRealEstateByIdApi = async (id: string): Promise<RealEstate | null> => {
  const { data, error } = await supabaseClient
    .from('real_estates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw parseSupabaseError(error);
  return data;
};
