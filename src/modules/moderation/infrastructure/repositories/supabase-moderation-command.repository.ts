import { handleSupabaseError } from '@/lib/errors';
import type { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  ModerationCommandRepository,
  ReportActionResponse,
  ReportRealEstateInput,
  ReportRealEstateReviewInput,
  ReportReviewInput,
} from '../../domain';

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

type RpcReportResult = {
  success: boolean;
  message?: string;
  error?: string;
};

function buildReportResponse(data: RpcReportResult | null): ReportActionResponse {
  if (!data?.success) {
    return {
      success: false,
      message: data?.error || 'Error al enviar el reporte',
      error: data?.error,
    };
  }

  return {
    success: true,
    message: data.message || 'Reporte enviado',
  };
}

export class SupabaseModerationCommandRepository implements ModerationCommandRepository {
  constructor(private readonly supabase: SupabaseServerClient) {}

  async reportReview(input: ReportReviewInput): Promise<ReportActionResponse> {
    const { data, error } = await this.supabase.rpc('report_review', {
      p_review_id: input.review_id,
      p_reason: input.reason,
      p_description: input.description,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return buildReportResponse(data as RpcReportResult | null);
  }

  async reportRealEstate(input: ReportRealEstateInput): Promise<ReportActionResponse> {
    const { data, error } = await this.supabase.rpc('report_real_estate', {
      p_real_estate_id: input.real_estate_id,
      p_reason: input.reason,
      p_description: input.description,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return buildReportResponse(data as RpcReportResult | null);
  }

  async reportRealEstateReview(input: ReportRealEstateReviewInput): Promise<ReportActionResponse> {
    const { data, error } = await this.supabase.rpc('report_real_estate_review', {
      p_real_estate_review_id: input.review_id,
      p_reason: input.reason,
      p_description: input.description,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return buildReportResponse(data as RpcReportResult | null);
  }
}
