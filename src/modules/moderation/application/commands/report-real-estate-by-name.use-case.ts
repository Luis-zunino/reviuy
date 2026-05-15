import { createError, RateLimitType } from '@/lib';
import { reportRealEstateApiSchema } from '@/schemas';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import type { ReportActionResponse } from '../../domain';

export interface ReportRealEstateByNameUseCaseDependencies {
  getCurrentUserId: () => Promise<string | null>;
  rateLimit: (key: string, scope: RateLimitType) => Promise<void>;
}

export const createReportRealEstateByNameUseCase = (
  dependencies: ReportRealEstateByNameUseCaseDependencies
): UseCaseHandler<unknown, ReportActionResponse> => {
  return async (input) => {
    const userId = await dependencies.getCurrentUserId();

    if (!userId) {
      throw createError('UNAUTHORIZED');
    }

    await dependencies.rateLimit(`report-real-estate:${userId}`, 'sensitive');

    reportRealEstateApiSchema.parse(input);

    return {
      success: true,
      message: 'Reporte validado',
    };
  };
};
