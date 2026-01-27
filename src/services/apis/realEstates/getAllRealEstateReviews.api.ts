import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReview } from '@/types';
import { parseSupabaseError } from '@/utils';

export const getAllRealEstateReviewsApi = async ({
  id,
  limit,
}: {
  id: string;
  limit?: number;
}): Promise<RealEstateReview[]> => {
  let query = supabaseClient
    .from('real_estate_reviews')
    .select('*')
    .eq('real_estate_id', id)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw parseSupabaseError(error);

  return data || [];
};
