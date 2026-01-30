import { supabaseClient } from '@/lib/supabase-client';
import type { ReportRealEstateRequest, ReportRealEstateResponse } from './types';
import { parseSupabaseError } from '@/utils';

export const reportRealEstate = async (
  data: ReportRealEstateRequest
): Promise<ReportRealEstateResponse> => {
  const { error } = await supabaseClient.rpc('report_real_estate', {
    p_real_estate_id: data.real_estate_id,
    p_reason: data.reason,
    p_description: data.description,
  });

  if (error) throw parseSupabaseError(error);

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

  if (error) throw parseSupabaseError(error);

  return data;
};
