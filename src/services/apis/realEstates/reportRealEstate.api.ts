import { supabaseClient } from '@/lib/supabase-client';
import type { ReportRealEstateRequest, ReportRealEstateResponse } from './types';

export const reportRealEstate = async (
  data: ReportRealEstateRequest
): Promise<ReportRealEstateResponse> => {
  try {
    const { error } = await supabaseClient.rpc('report_real_estate', {
      p_real_estate_id: data.real_estate_id,
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

export const hasUserReportedRealEstate = async (realEstateId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabaseClient.rpc('has_user_reported_real_estate', {
      p_real_estate_id: realEstateId,
    });

    if (error) {
      return false;
    }

    return data;
  } catch (error) {
    return !!error;
  }
};
