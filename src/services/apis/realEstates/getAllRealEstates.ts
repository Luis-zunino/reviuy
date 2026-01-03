import { supabaseClient } from '@/lib/supabase-client';
import { RealEstate } from '@/types/realEstate';
import type { GetAllRealEstatesParams } from './types';

export const getAllRealEstates = async ({ limit }: GetAllRealEstatesParams = {}): Promise<
  RealEstate[]
> => {
  try {
    let query = supabaseClient
      .from('real_estates')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching real estates:', error);
      throw new Error('Failed to fetch real estates');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllRealEstates:', error);
    throw error;
  }
};
