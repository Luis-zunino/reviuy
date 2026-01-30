import { supabaseClient } from '@/lib/supabase-client';
import type { ReportRealEstateReviewRequest, ReportRealEstateReviewResponse } from './types';
import { parseSupabaseError } from '@/utils';

export const reportRealEstateReview = async (
  data: ReportRealEstateReviewRequest
): Promise<ReportRealEstateReviewResponse> => {
  const { error } = await supabaseClient.rpc('report_real_estate_review', {
    p_real_estate_review_id: data.review_id,
    p_reason: data.reason,
    p_description: data.description,
  });

  if (error) throw parseSupabaseError(error);

  return {
    success: true,
    message: 'Reporte enviado',
  };
};

export const hasUserReportedRealEstateReview = async (reviewId: string): Promise<boolean> => {
  const { data, error } = await supabaseClient.rpc('has_user_reported_real_estate_review', {
    p_review_id: reviewId,
  });

  if (error) throw parseSupabaseError(error);

  return data;
};
