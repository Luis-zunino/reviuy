import { supabaseClient } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/errors';
import { RealEstateInsert, RealEstate } from '@/types/real-estate';

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

  if (error) throw handleSupabaseError(error);

  return data;
};
