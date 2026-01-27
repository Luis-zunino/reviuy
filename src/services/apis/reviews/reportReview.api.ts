import { supabaseClient } from '@/lib/supabase-client';
import { CreateReviewReportRequest, CreateReviewReportResponse } from '@/types/reportReview.type';
import { parseSupabaseError } from '@/utils';

/**
 * Reporta una review por contenido inapropiado
 */
export const reportReview = async (
  data: CreateReviewReportRequest
): Promise<CreateReviewReportResponse> => {
  const { error } = await supabaseClient.rpc('report_review', {
    p_review_id: data.review_id,
    p_reason: data.reason,
    p_description: data.description,
  });

  if (error) throw parseSupabaseError(error);

  // Asumiendo que la RPC function retorna el formato esperado
  return {
    success: true,
    message: 'Reporte enviado exitosamente',
  };
};

export const hasUserReportedReview = async (reviewId: string): Promise<boolean> => {
  const { data, error } = await supabaseClient.rpc('has_user_reported_review', {
    p_review_id: reviewId,
  });

  if (error) throw parseSupabaseError(error);

  return data;
};
