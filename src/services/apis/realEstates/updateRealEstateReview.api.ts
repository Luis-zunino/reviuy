import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReviewUpdate } from '@/types';
import { verifyAuthentication } from '../user';
import type { UpdateRealEstateReviewResponse } from './types';

export const updateRealEstateReview = async (
  updateRealEstateReviewData: RealEstateReviewUpdate
): Promise<UpdateRealEstateReviewResponse> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await verifyAuthentication();

    if (authError || !user) {
      return {
        success: false,
        message: 'Debes iniciar sesión para crear una reseña',
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
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error('Error al crear la reseña', { cause: error.message });
    }

    return {
      success: true,
      message: 'Reseña creada exitosamente',
      data,
    };
  } catch (error) {
    throw new Error('Error al crear la reseña', { cause: error });
  }
};
