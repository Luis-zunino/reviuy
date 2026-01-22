import { supabaseClient } from '@/lib/supabase-client';

export const isRealEstateFavorite = async ({
  realEstateId,
}: {
  realEstateId: string;
}): Promise<boolean> => {
  try {
    const { data, error } = await supabaseClient.rpc('is_real_estate_favorite', {
      p_real_estate_id: realEstateId,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error checking if favorite:', error);
    return false;
  }
};
