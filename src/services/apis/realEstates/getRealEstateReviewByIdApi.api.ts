import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReview } from '@/types';

export const getRealEstateReviewByIdApi = async ({
  reviewId,
}: {
  reviewId: string;
}): Promise<RealEstateReview | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('real_estate_reviews')
      .select('*')
      .eq('id', reviewId)
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (error) {
      console.error('Error fetching real estate reviews:', error);
      throw new Error('Failed to fetch real estate reviews');
    }

    return data;
  } catch (error) {
    console.error('Error in getAllRealEstateReviews:', error);
    throw error;
  }
};
