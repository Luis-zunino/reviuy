import { supabaseClient } from '@/lib/supabase-client';
import { DeleteReviewResponse } from './types';

export interface DeleteReviewRequest {
  reviewId: string;
  userId?: string | null;
}

export const deleteReview = async ({
  reviewId,
  userId,
}: DeleteReviewRequest): Promise<DeleteReviewResponse> => {
  try {
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

    if (fetchError) {
      return {
        success: false,
        message: 'No se pudo encontrar la reseña',
        error: fetchError.message,
      };
    }

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

    if (deleteError) {
      return {
        success: false,
        message: 'Error al eliminar la reseña',
        error: deleteError.message,
      };
    }

    return {
      success: true,
      message: 'Reseña eliminada exitosamente',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error inesperado al eliminar la reseña',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
