import { supabaseClient } from '@/lib/supabase';
import type { ReportRealEstateRequest, ReportRealEstateResponse } from './types';
import { handleSupabaseError } from '@/lib/errors';

export const reportRealEstate = async (
  data: ReportRealEstateRequest
): Promise<ReportRealEstateResponse> => {
  const { error } = await supabaseClient.rpc('report_real_estate', {
    p_real_estate_id: data.real_estate_id,
    p_reason: data.reason,
    p_description: data.description,
  });

  if (error) throw handleSupabaseError(error);

  return {
    success: true,
    message: 'Reporte enviado',
  };
};

export const hasUserReportedRealEstate = async (realEstateId?: string): Promise<boolean> => {
  if (!realEstateId) return false;
  const { data, error } = await supabaseClient.rpc('has_user_reported_real_estate', {
    p_real_estate_id: realEstateId,
  });

  if (error) throw handleSupabaseError(error);

  return data;
};
