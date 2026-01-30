import { supabaseClient } from '@/lib/supabase-client';
import { RealEstateWitheVotes } from '@/types/realEstate';
import type { SearchRealEstatesParams } from './types';
import { parseSupabaseError } from '@/utils';

export const searchRealEstates = async ({
  query,
  limit = 10,
}: SearchRealEstatesParams): Promise<RealEstateWitheVotes[]> => {
  const { data, error } = await supabaseClient
    .from('real_estates_with_votes')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(limit)
    .order('name');

  if (error) throw parseSupabaseError(error);

  return data || [];
};
