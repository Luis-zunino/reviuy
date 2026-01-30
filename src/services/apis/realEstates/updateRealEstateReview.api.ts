import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReviewUpdate } from '@/types';
import type { UpdateRealEstateReviewResponse } from './types';
import { parseSupabaseError } from '@/utils';

export const updateRealEstateReview = async (
  updateRealEstateReviewData: RealEstateReviewUpdate & { user_id?: string }
): Promise<UpdateRealEstateReviewResponse> => {
  if (!updateRealEstateReviewData.user_id) {
    return {
      success: false,
      message: 'Debes iniciar sesión para actualizar una reseña de una inmobiliaria',
      error: 'Usuario no autenticado',
    };
  }
  if (!updateRealEstateReviewData.id)
    return {
      success: false,
      message: 'Debes indicar el id de la review a actualizar',
      error: 'Resena no encontrada',
    };

  const { error, data } = await supabaseClient
    .from('real_estate_reviews')
    .update(updateRealEstateReviewData)
    .eq('id', updateRealEstateReviewData.id)
    .eq('user_id', updateRealEstateReviewData.user_id)
    .select()
    .single();

  if (error) throw parseSupabaseError(error);

  return {
    success: true,
    message: 'Reseña creada',
    data,
  };
};
