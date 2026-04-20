'use server';

import {
  createReportReviewUseCase,
  createReportRealEstateUseCase,
  createReportRealEstateReviewUseCase,
} from '../application';
import { SupabaseModerationCommandRepository } from '../infrastructure';
import type { ReportActionResponse } from '../domain';
import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';

export async function reportReviewAction(input: unknown): Promise<ReportActionResponse> {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const reportReviewUseCase = createReportReviewUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseModerationCommandRepository(supabase),
  });

  return reportReviewUseCase(input);
}

export async function reportRealEstateAction(input: unknown): Promise<ReportActionResponse> {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const reportRealEstateUseCase = createReportRealEstateUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseModerationCommandRepository(supabase),
  });

  return reportRealEstateUseCase(input);
}

export async function reportRealEstateReviewAction(input: unknown): Promise<ReportActionResponse> {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const reportRealEstateReviewUseCase = createReportRealEstateReviewUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseModerationCommandRepository(supabase),
  });

  return reportRealEstateReviewUseCase(input);
}
