import { supabaseClient } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/errors';

export const hasUserReportedRealEstate = async (realEstateId?: string): Promise<boolean> => {
  if (!realEstateId) return false;
  const { data, error } = await supabaseClient.rpc('has_user_reported_real_estate', {
    p_real_estate_id: realEstateId,
  });

  if (error) throw handleSupabaseError(error);

  return data;
};
