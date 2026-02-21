import { supabaseClient } from '@/lib/supabase';
import { RealEstateWitheVotes } from '@/types/real-estate';
import type { SearchRealEstatesParams } from './types';
import { handleSupabaseError } from '@/lib/errors';

export const searchRealEstates = async ({
  query,
  limit = 10,
}: SearchRealEstatesParams): Promise<RealEstateWitheVotes[]> => {
  if (!query || query.length < 3) return [];

  const { data, error } = await supabaseClient
    .from('real_estates_with_votes')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(limit)
    .order('name');

  if (error) throw handleSupabaseError(error);

  return data || [];
};
