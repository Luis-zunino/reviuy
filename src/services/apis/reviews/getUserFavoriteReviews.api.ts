import { supabaseClient } from '@/lib/supabase-client';
import type { Review } from '@/types';

export const getUserFavoriteReviews = async (): Promise<Review[]> => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabaseClient
    .from('review_favorites')
    .select(`review_id, reviews(*)`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Extraer solo los datos de reviews
  return (data
    ?.map(
      (item: {
        review_id: string;
        reviews: {
          id: string;
          title: string;
          description: string;
          rating: number;
          zone_rating: number | null;
          likes: number;
          dislikes: number;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
      }) => item.reviews
    )
    .filter(Boolean) || []) as Review[];
};
