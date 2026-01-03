import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReview } from '@/types';

export const getAllRealEstateReviewsApi = async ({
  id,
  limit,
}: {
  id: string;
  limit?: number;
}): Promise<RealEstateReview[]> => {
  try {
    let query = supabaseClient
      .from('real_estate_reviews')
      .select('*')
      .eq('real_estate_id', id)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching real estate reviews:', error);
      throw new Error('Failed to fetch real estate reviews');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllRealEstateReviews:', error);
    throw error;
  }
};
