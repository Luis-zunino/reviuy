import { supabaseClient } from '@/lib/supabase-client';
import { DeleteReviewResponse } from './types';
import { parseSupabaseError } from '@/utils';

export interface DeleteReviewRequest {
  reviewId?: string;
  user_id?: string | null;
}

export const deleteReview = async ({
  reviewId,
  user_id,
}: DeleteReviewRequest): Promise<DeleteReviewResponse> => {
  if (!reviewId)
    return {
      success: false,
      message: 'No hay reviewId',
      error: 'Reseña no encontrada',
    };
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

  if (review.user_id !== user_id) {
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
    .eq('user_id', user_id);

  if (deleteError) throw parseSupabaseError(deleteError);

  return {
    success: true,
    message: 'Reseña eliminada',
  };
};
