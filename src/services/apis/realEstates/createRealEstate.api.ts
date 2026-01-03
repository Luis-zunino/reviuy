import { supabaseClient } from '@/lib/supabase-client';
import { RealEstateInsert, RealEstate } from '@/types/realEstate';

export const createRealEstate = async (realEstateData: RealEstateInsert): Promise<RealEstate> => {
  try {
    const { data, error } = await supabaseClient
      .from('real_estates')
      .insert(realEstateData)
      .select()
      .single();

    if (error) {
      console.error('Error creating real estate:', error);
      throw new Error('Failed to create real estate');
    }

    return data;
  } catch (error) {
    console.error('Error in createRealEstate:', error);
    throw error;
  }
};
