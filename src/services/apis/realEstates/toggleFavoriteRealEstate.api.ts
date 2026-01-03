import { supabaseClient } from '@/lib/supabase-client';
import type { ToggleFavoriteRealEstateRequest, ToggleFavoriteRealEstateResponse } from './types';

export const toggleFavoriteRealEstate = async ({
  realEstateId,
}: ToggleFavoriteRealEstateRequest): Promise<ToggleFavoriteRealEstateResponse> => {
  try {
    const { data, error } = await supabaseClient.rpc('toggle_favorite_real_estate', {
      p_real_estate_id: realEstateId,
    });

    if (error) {
      throw error;
    }

    return data as unknown as ToggleFavoriteRealEstateResponse;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};
