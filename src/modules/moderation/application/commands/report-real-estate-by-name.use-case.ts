import { RateLimitType } from '@/lib/redis';
import { assertAuthenticated } from '@/shared/auth/assert-authenticated.util';
import { reportRealEstateApiSchema } from '@/schemas/api-request.schema';
import type { UseCaseHandler } from '@/shared/kernel/contracts/use-case.contract';
import type { ReportActionResponse } from '../../domain';

export interface ReportRealEstateByNameUseCaseDependencies {
  getCurrentUserId: () => Promise<string | null>;
  rateLimit: (key: string, scope: RateLimitType) => Promise<void>;
}

export const createReportRealEstateByNameUseCase = (
  dependencies: ReportRealEstateByNameUseCaseDependencies
): UseCaseHandler<unknown, ReportActionResponse> => {
  return async (input) => {
    const userId = await assertAuthenticated(dependencies.getCurrentUserId);

    await dependencies.rateLimit(`report-real-estate:${userId}`, 'sensitive');

    reportRealEstateApiSchema.parse(input);

    return {
      success: true,
      message: 'Reporte validado',
    };
  };
};
