import { supabaseClient } from '@/lib/supabase-client';
import type { Review } from '@/types';

export const getReviewsByRealEstateIdApi = async (realEstateId: string): Promise<Review[]> => {
  const { data, error } = await supabaseClient
    .from('reviews')
    .select('*')
    .eq('real_estate_id', realEstateId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};
