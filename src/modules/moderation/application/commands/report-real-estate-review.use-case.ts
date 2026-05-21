import { z } from 'zod';
import { assertAuthenticated } from '@/shared/auth/assert-authenticated.util';
import type { UseCaseHandler } from '@/shared/kernel/contracts/use-case.contract';
import { reportRealEstateReviewApiSchema } from '@/schemas/api-request.schema';
import type { ReportActionResponse } from '../../domain';
import { ModerationCommandBase } from './interfaces';

const reportRealEstateReviewActionSchema = reportRealEstateReviewApiSchema
  .omit({ realEstateReviewUuid: true, message: true })
  .extend({
    review_id: z.string().uuid('El identificador de reseña no es valido'),
    description: z
      .string()
      .trim()
      .max(2000, 'El mensaje no puede superar 2000 caracteres')
      .optional(),
  });

export const createReportRealEstateReviewUseCase = (
  dependencies: ModerationCommandBase
): UseCaseHandler<unknown, ReportActionResponse> => {
  return async (input) => {
    const userId = await assertAuthenticated(dependencies.getCurrentUserId);

    await dependencies.rateLimit(`report-real-estate-review:${userId}`, 'sensitive');

    const payload = reportRealEstateReviewActionSchema.parse(input);

    return dependencies.repository.reportRealEstateReview(payload);
  };
};
