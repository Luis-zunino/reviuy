import { supabaseClient } from '@/lib/supabase';
import type { CheckUserReviewForAddressParams, CheckUserReviewForAddressResponse } from './types';
import { handleSupabaseError } from '@/lib/errors';

export const checkUserReviewForAddressApi = async ({
  osmId,
}: CheckUserReviewForAddressParams): Promise<CheckUserReviewForAddressResponse | null> => {
  if (!osmId) return null;

  const { data, error } = await supabaseClient.rpc('check_user_review_for_address', {
    p_osm_id: osmId,
  });

  if (error) throw handleSupabaseError(error);

  return data ? { id: data } : null;
};
