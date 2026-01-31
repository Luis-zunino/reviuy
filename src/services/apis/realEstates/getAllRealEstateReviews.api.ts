import { supabaseClient } from '@/lib/supabase';
import type { RealEstateReviewWithVotes } from '@/types';
import { handleSupabaseError } from '@/lib/errors';

export const getAllRealEstateReviewsApi = async ({
  id,
  limit,
}: {
  id: string;
  limit?: number;
}): Promise<RealEstateReviewWithVotes[]> => {
  let query = supabaseClient
    .from('real_estate_reviews_with_votes')
    .select('*')
    .eq('real_estate_id', id)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw handleSupabaseError(error);

  return data || [];
};
