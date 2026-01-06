import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReviewInsert } from '@/types';
import type { CreateRealEstateReviewResponse } from './types';
import { User } from '@supabase/supabase-js';

export interface CreateRealEstateReviewRequest {
  createRealEstateReviewData: RealEstateReviewInsert;
  user?: User | null;
}
export const createRealEstateReview = async ({
  createRealEstateReviewData,
  user,
}: CreateRealEstateReviewRequest): Promise<CreateRealEstateReviewResponse> => {
  try {
    if (!user) {
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
