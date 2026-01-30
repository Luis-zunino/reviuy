import { supabaseClient } from '@/lib/supabase-client';
import { RealEstateWitheVotes } from '@/types/realEstate';
import { GetRealEstatesPageParams } from './types/getRealEstatesPage.types';
import { parseSupabaseError } from '@/utils';

export const getAllRealEstatesPaginated = async ({
  limit = 10,
  offset = 0,
  search,
  rating,
}: GetRealEstatesPageParams): Promise<{
  data: RealEstateWitheVotes[];
  nextOffset: number | null;
}> => {
  const start = offset;
  const end = offset + limit - 1;

  let query = supabaseClient.from('real_estates_with_votes').select('*', { count: 'exact' });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (rating && rating > 0) {
    query = query.gte('rating', rating);
  }

  const { data, error } = await query.order('created_at', { ascending: false }).range(start, end);

  if (error) throw parseSupabaseError(error);

  const items: RealEstateWitheVotes[] = data || [];
  const nextOffset = items.length < limit ? null : offset + items.length;

  return { data: items, nextOffset };
};
