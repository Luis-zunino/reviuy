import { supabaseClient } from '@/lib/supabase-client';
import type { DeleteRealEstateReviewParams, DeleteRealEstateReviewResponse } from './types';

export const deleteRealEstateReview = async (
  params: DeleteRealEstateReviewParams
): Promise<DeleteRealEstateReviewResponse> => {
  try {
    // Extraer reviewId del parámetro (puede ser string o objeto)
    const { reviewId, user } = params;

    if (!reviewId) {
      return {
        success: false,
        message: 'ID de reseña inválido',
        error: 'reviewId no proporcionado',
      };
    }

    if (!user) {
      return {
        success: false,
        message: 'Debes iniciar sesión para eliminar una reseña',
        error: 'Usuario no autenticado',
      };
    }

    const { data: realEstateReview, error: fetchError } = await supabaseClient
      .from('real_estate_reviews')
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

    if (!realEstateReview) {
      return {
        success: false,
        message: 'La reseña no existe',
        error: 'Reseña no encontrada',
      };
    }

    if (realEstateReview.user_id !== user.id) {
      return {
        success: false,
        message: 'No tienes permisos para eliminar esta reseña',
        error: 'Permisos insuficientes',
      };
    }

    const { error: deleteError } = await supabaseClient
      .from('real_estate_reviews')
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
