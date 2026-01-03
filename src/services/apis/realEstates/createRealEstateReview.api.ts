import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReviewInsert } from '@/types';
import { verifyAuthentication } from '../user';
import type { CreateRealEstateReviewResponse } from './types';

export const createRealEstateReview = async (
  createRealEstateReviewData: RealEstateReviewInsert
): Promise<CreateRealEstateReviewResponse> => {
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
    const { error, data } = await supabaseClient
      .from('real_estate_reviews')
      .insert([createRealEstateReviewData])
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
