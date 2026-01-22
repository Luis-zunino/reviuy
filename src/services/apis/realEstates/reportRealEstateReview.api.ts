import { supabaseClient } from '@/lib/supabase-client';
import type { ReportRealEstateReviewRequest, ReportRealEstateReviewResponse } from './types';

export const reportRealEstateReview = async (
  data: ReportRealEstateReviewRequest
): Promise<ReportRealEstateReviewResponse> => {
  try {
    const { error } = await supabaseClient.rpc('report_real_estate_review', {
      p_real_estate_review_id: data.review_id,
      p_reason: data.reason,
      p_description: data.description,
    });

    if (error) {
      return {
        success: false,
        error: 'Error al enviar el reporte. Por favor, intenta de nuevo.',
      };
    }

    return {
      success: true,
      message: 'Reporte enviado exitosamente',
    };
  } catch (error) {
    return {
      success: !!error,
      error: 'Error inesperado. Por favor, intenta de nuevo.',
    };
  }
};

export const hasUserReportedRealEstateReview = async (reviewId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabaseClient.rpc('has_user_reported_real_estate_review', {
      p_review_id: reviewId,
    });

    if (error) {
      return false;
    }

    return data;
  } catch (error) {
    return !!error;
  }
};
