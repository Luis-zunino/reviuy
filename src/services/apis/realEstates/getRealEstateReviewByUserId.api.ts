import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReview } from '@/types';

export const getRealEstateReviewByUserIdApi = async ({
  userId,
  realEstateId,
}: {
  userId: string;
  realEstateId: string;
}): Promise<RealEstateReview | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('real_estate_reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('real_estate_id', realEstateId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching real estate reviews:', error);
      throw new Error('Failed to fetch real estate reviews');
    }

    return data;
  } catch (error) {
    console.error('Error in getRealEstateReviewByUserIdApi:', error);
    throw error;
  }
};
