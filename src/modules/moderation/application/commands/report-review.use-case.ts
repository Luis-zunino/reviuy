import { z } from 'zod';
import { createError } from '@/lib';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { reportReviewApiSchema } from '@/schemas';
import type { ReportActionResponse, ReportReviewInput } from '../../domain';
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
    const userId = await dependencies.getCurrentUserId();

    if (!userId) {
      throw createError('UNAUTHORIZED');
    }

    await dependencies.rateLimit(`report-review:${userId}`, 'sensitive');

    const payload = reportReviewActionSchema.parse(input) as ReportReviewInput;

    return dependencies.repository.reportReview(payload);
  };
};
