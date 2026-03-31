import { handleSupabaseError } from '@/lib';
import type { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  ModerationCommandRepository,
  ReportActionResponse,
  ReportRealEstateInput,
  ReportRealEstateReviewInput,
  ReportReviewInput,
} from '../../domain';

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export class SupabaseModerationCommandRepository implements ModerationCommandRepository {
  constructor(private readonly supabase: SupabaseServerClient) {}

  async reportReview(input: ReportReviewInput): Promise<ReportActionResponse> {
    const { error } = await this.supabase.rpc('report_review', {
      p_review_id: input.review_id,
      p_reason: input.reason,
      p_description: input.description,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return {
      success: true,
      message: 'Reporte enviado',
    };
  }

  async reportRealEstate(input: ReportRealEstateInput): Promise<ReportActionResponse> {
    const { error } = await this.supabase.rpc('report_real_estate', {
      p_real_estate_id: input.real_estate_id,
      p_reason: input.reason,
      p_description: input.description,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return {
      success: true,
      message: 'Reporte enviado',
    };
  }

  async reportRealEstateReview(input: ReportRealEstateReviewInput): Promise<ReportActionResponse> {
    const { error } = await this.supabase.rpc('report_real_estate_review', {
      p_real_estate_review_id: input.review_id,
      p_reason: input.reason,
      p_description: input.description,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return {
      success: true,
      message: 'Reporte enviado',
    };
  }
}
