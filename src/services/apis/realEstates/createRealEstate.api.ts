import { supabaseClient } from '@/lib/supabase-client';
import { RealEstateInsert, RealEstate } from '@/types/realEstate';
import { parseSupabaseError } from '@/utils';

export const createRealEstate = async (
  realEstateData: RealEstateInsert & {
    user_id?: string;
  }
): Promise<RealEstate> => {
  const payload = { ...realEstateData };
  delete payload.user_id;

  const { data, error } = await supabaseClient
    .from('real_estates')
    .insert(payload)
    .select()
    .single();

  if (error) throw parseSupabaseError(error);

  return data;
};
