'use server';

import {
  createReportReviewUseCase,
  createReportRealEstateUseCase,
  createReportRealEstateReviewUseCase,
} from '@/modules/moderation/application';
import { SupabaseModerationCommandRepository } from '@/modules/moderation/infrastructure';
import type { ReportActionResponse } from '@/modules/moderation/domain';
import { createModerationDeps } from './utils';

export async function reportReviewAction(input: unknown): Promise<ReportActionResponse> {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const reportReviewUseCase = createReportReviewUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseModerationCommandRepository(supabase),
  });

  return reportReviewUseCase(input);
}

export async function reportRealEstateAction(input: unknown): Promise<ReportActionResponse> {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const reportRealEstateUseCase = createReportRealEstateUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseModerationCommandRepository(supabase),
  });

  return reportRealEstateUseCase(input);
}

export async function reportRealEstateReviewAction(input: unknown): Promise<ReportActionResponse> {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const reportRealEstateReviewUseCase = createReportRealEstateReviewUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseModerationCommandRepository(supabase),
  });

  return reportRealEstateReviewUseCase(input);
}
