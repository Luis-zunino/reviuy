import { z } from 'zod';
import { assertAuthenticated } from '@/shared/auth/assert-authenticated.util';
import type { UseCaseHandler } from '@/shared/kernel/contracts/use-case.contract';
import { reportReviewApiSchema } from '@/schemas/api-request.schema';
import type { ReportActionResponse } from '../../domain';
import { ModerationCommandBase } from './interfaces';

const reportReviewActionSchema = reportReviewApiSchema
  .omit({ reviewUuid: true, message: true })
  .extend({
    review_id: z.string().uuid('El identificador de reseña no es valido'),
    description: z
      .string()
      .trim()
      .max(2000, 'El mensaje no puede superar 2000 caracteres')
      .optional(),
  });

export const createReportReviewUseCase = (
  dependencies: ModerationCommandBase
): UseCaseHandler<unknown, ReportActionResponse> => {
  return async (input) => {
    const userId = await assertAuthenticated(dependencies.getCurrentUserId);

    await dependencies.rateLimit(`report-review:${userId}`, 'sensitive');

    const payload = reportReviewActionSchema.parse(input);

    return dependencies.repository.reportReview(payload);
  };
};
