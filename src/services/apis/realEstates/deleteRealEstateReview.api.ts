import { supabaseClient } from '@/lib/supabase-client';
import type { DeleteRealEstateReviewParams, DeleteRealEstateReviewResponse } from './types';
import { parseSupabaseError } from '@/utils';

export const deleteRealEstateReview = async (
  params: DeleteRealEstateReviewParams
): Promise<DeleteRealEstateReviewResponse> => {
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

  if (fetchError) throw parseSupabaseError(fetchError);

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

  if (deleteError) throw parseSupabaseError(deleteError);

  return {
    success: true,
    message: 'Reseña eliminada exitosamente',
  };
};
