import { supabaseClient } from '@/lib/supabase-client';
import { CreateReviewReportRequest, CreateReviewReportResponse } from '@/types/reportReview.type';

/**
 * Reporta una review por contenido inapropiado
 */
export const reportReview = async (
  data: CreateReviewReportRequest
): Promise<CreateReviewReportResponse> => {
  try {
    const { error } = await supabaseClient.rpc('report_review', {
      p_review_id: data.review_id,
      p_reason: data.reason,
      p_description: data.description,
    });

    if (error) {
      return {
        success: false,
        error: 'Error al enviar el reporte. Por favor, intenta de nuevo.',
      };
    }

    // Asumiendo que la RPC function retorna el formato esperado
    return {
      success: true,
      message: 'Reporte enviado exitosamente',
    };
  } catch (error) {
    return {
      success: false,
      error: `Error inesperado. Por favor, intenta de nuevo. ${error}`,
    };
  }
};

export const hasUserReportedReview = async (reviewId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabaseClient.rpc('has_user_reported_review', {
      p_review_id: reviewId,
    });

    if (error) {
      return false;
    }

    return data as boolean;
  } catch (error) {
    return !!error;
  }
};
