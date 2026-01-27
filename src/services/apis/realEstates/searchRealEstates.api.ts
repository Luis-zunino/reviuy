import { supabaseClient } from '@/lib/supabase-client';
import { RealEstate } from '@/types/realEstate';
import type { SearchRealEstatesParams } from './types';
import { parseSupabaseError } from '@/utils';

export const searchRealEstates = async ({
  query,
  limit = 10,
}: SearchRealEstatesParams): Promise<RealEstate[]> => {
  const { data, error } = await supabaseClient
    .from('real_estates')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(limit)
    .order('name');

  if (error) throw parseSupabaseError(error);

  return data || [];
};
