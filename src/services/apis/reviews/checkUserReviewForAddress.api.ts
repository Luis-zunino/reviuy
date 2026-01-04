import { supabaseClient } from '@/lib/supabase-client';
import type { CheckUserReviewForAddressParams, CheckUserReviewForAddressResponse } from './types';

export const checkUserReviewForAddressApi = async ({
  userId,
  osmId,
}: CheckUserReviewForAddressParams): Promise<CheckUserReviewForAddressResponse | null> => {
  const { data, error } = await supabaseClient
    .from('reviews')
    .select('id')
    .eq('user_id', userId ?? '')
    .eq('address_osm_id', osmId ?? '')
    .maybeSingle();

  if (error) throw error;
  return data;
};
