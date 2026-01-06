import { supabaseClient } from '@/lib/supabase-client';
import { RealEstate } from '@/types/realEstate';
import type { SearchRealEstatesParams } from './types';

export const searchRealEstates = async ({
  query,
  limit = 10,
}: SearchRealEstatesParams): Promise<RealEstate[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('real_estates')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(limit)
      .order('name');

    if (error) {
      console.error('Error searching real estates:', error);
      throw new Error('Failed to search real estates');
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchRealEstates:', error);
    throw error;
  }
};
