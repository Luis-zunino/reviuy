import { supabaseClient } from '@/lib/supabase-client';
import { verifyAuthentication } from '../user';
import type { DeleteReviewResponse } from './types';

export const deleteReview = async (reviewId: string): Promise<DeleteReviewResponse> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await verifyAuthentication();

    if (authError || !user) {
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

    if (review.user_id !== user.id) {
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
      .eq('user_id', user.id);

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
