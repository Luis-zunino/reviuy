import { supabaseClient } from '@/lib/supabase-client';
import { RealEstateInsert, RealEstate } from '@/types/realEstate';
import { parseSupabaseError } from '@/utils';

export const createRealEstate = async (realEstateData: RealEstateInsert): Promise<RealEstate> => {
  const { data, error } = await supabaseClient
    .from('real_estates')
    .insert(realEstateData)
    .select()
    .single();

  if (error) throw parseSupabaseError(error);

  return data;
};
