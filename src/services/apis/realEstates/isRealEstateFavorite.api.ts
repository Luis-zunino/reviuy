import { supabaseClient } from '@/lib/supabase-client';
import { parseSupabaseError } from '@/utils';

export const isRealEstateFavorite = async ({
  realEstateId,
}: {
  realEstateId: string;
}): Promise<boolean> => {
  const { data, error } = await supabaseClient.rpc('is_real_estate_favorite', {
    p_real_estate_id: realEstateId,
  });

  if (error) throw parseSupabaseError(error);

  return Boolean(data);
};
