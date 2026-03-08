import { supabaseClient } from '@/lib/supabase';
import type { ReviewWithVotesPublic } from '@/types';
import { handleSupabaseError } from '@/lib/errors';

export const getReviewsByRealEstateIdApi = async (
  realEstateId: string
): Promise<ReviewWithVotesPublic[]> => {
  const { data, error } = await supabaseClient
    .from('reviews_with_votes_public')
    .select('*')
    .eq('real_estate_id', realEstateId)
    .order('created_at', { ascending: false });

  if (error) throw handleSupabaseError(error);
  return data;
};
