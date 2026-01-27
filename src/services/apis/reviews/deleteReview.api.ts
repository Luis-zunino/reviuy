import { supabaseClient } from '@/lib/supabase-client';
import { DeleteReviewResponse } from './types';
import { parseSupabaseError } from '@/utils';

export interface DeleteReviewRequest {
  reviewId: string;
  userId?: string | null;
}

export const deleteReview = async ({
  reviewId,
  userId,
}: DeleteReviewRequest): Promise<DeleteReviewResponse> => {
  if (!userId) {
    return {
      success: false,
      message: 'Debes iniciar sesión para eliminar una reseña',
      error: 'Usuario no autenticado',
    };
  }

  const { data: review, error: fetchError } = await supabaseClient
    .from('reviews')
    .select('id, user_id, title')
    .eq('id', reviewId)
    .single();

  if (fetchError) throw parseSupabaseError(fetchError);

  if (!review) {
    return {
      success: false,
      message: 'La reseña no existe',
      error: 'Reseña no encontrada',
    };
  }

  if (review.user_id !== userId) {
    return {
      success: false,
      message: 'No tienes permisos para eliminar esta reseña',
      error: 'Permisos insuficientes',
    };
  }

  const { error: deleteError } = await supabaseClient
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', userId);

  if (deleteError) throw parseSupabaseError(deleteError);

  return {
    success: true,
    message: 'Reseña eliminada exitosamente',
  };
};
