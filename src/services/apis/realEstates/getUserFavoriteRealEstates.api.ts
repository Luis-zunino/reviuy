import { supabaseClient } from '@/lib/supabase';
import type { RealEstateWitheVotes } from '@/types';
import { handleSupabaseError } from '@/lib/errors';
import { verifyAuthentication } from '../user/verifyAuthentication.api';

export const getUserFavoriteRealEstates = async (): Promise<RealEstateWitheVotes[]> => {
  const { userId } = await verifyAuthentication();
  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabaseClient
    .from('real_estate_favorites')
    .select(
      `
        real_estate_id,
        real_estates:real_estates_with_votes (
          id,
          name,
          created_at,
          likes,
          dislikes
        )
      `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw handleSupabaseError(error);
  // Extraer solo los datos de real_estates
  return (data
    ?.map(
      (item: {
        real_estate_id: string;
        real_estates: {
          id?: string | null;
          name?: string | null;
          created_at: string | null;
          likes?: number | null;
          dislikes?: number | null;
        };
      }) => item.real_estates
    )
    .filter(Boolean) || []) as RealEstateWitheVotes[];
};
