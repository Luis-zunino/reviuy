import { supabaseClient } from '@/lib/supabase-client';
import { RealEstate } from '@/types/realEstate';

export const getRealEstateByIdApi = async (id: string): Promise<RealEstate | null> => {
  const { data, error } = await supabaseClient
    .from('real_estates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error('Failed to fetch real estate');
  }

  return data;
};
