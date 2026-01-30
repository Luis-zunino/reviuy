import { supabaseClient } from '@/lib/supabase-client';
import type { RealEstateReviewInsert } from '@/types';
import type { CreateRealEstateReviewResponse } from './types';
import { parseSupabaseError } from '@/utils';

export const createRealEstateReview = async (
  dataForm: RealEstateReviewInsert & { user_id?: string }
): Promise<CreateRealEstateReviewResponse> => {
  if (!dataForm.user_id) {
    return {
      success: false,
      message: 'Debes iniciar sesión para crear una reseña',
      error: 'Usuario no autenticado',
    };
  }
  const { error, data } = await supabaseClient
    .from('real_estate_reviews')
    .insert([dataForm])
    .select()
    .single();
  if (error) throw parseSupabaseError(error);

  return {
    success: true,
    message: 'Reseña creada',
    data,
  };
};
