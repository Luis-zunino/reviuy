import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstate } from '@/types';

export const getUserFavoriteRealEstates = async (): Promise<RealEstate[]> => {
  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabaseClient
      .from('real_estate_favorites')
      .select(
        `
        real_estate_id,
        real_estates (
          id,
          name,
          created_at,
          likes,
          dislikes
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Extraer solo los datos de real_estates
    return (data
      ?.map(
        (item: {
          real_estate_id: string;
          real_estates: {
            id: string;
            name: string;
            created_at: string;
            likes: number;
            dislikes: number;
          };
        }) => item.real_estates
      )
      .filter(Boolean) || []) as RealEstate[];
  } catch (error) {
    console.error('Error fetching favorite real estates:', error);
    throw error;
  }
};
