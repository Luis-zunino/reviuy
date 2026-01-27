import { supabaseClient } from '@/lib/supabase-client';
import type { ToggleFavoriteRealEstateRequest, ToggleFavoriteRealEstateResponse } from './types';
import { parseSupabaseError } from '@/utils';

export const toggleFavoriteRealEstate = async ({
  realEstateId,
}: ToggleFavoriteRealEstateRequest): Promise<ToggleFavoriteRealEstateResponse> => {
  const { data, error } = await supabaseClient.rpc('toggle_favorite_real_estate', {
    p_real_estate_id: realEstateId,
  });

  if (error) throw parseSupabaseError(error);

  return data;
};
