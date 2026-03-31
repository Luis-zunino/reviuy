import { z } from 'zod';
import { createError } from '@/lib';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { reportRealEstateReviewApiSchema } from '@/schemas';
import type { ReportActionResponse, ReportRealEstateReviewInput } from '../../domain';
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
    const userId = await dependencies.getCurrentUserId();

    if (!userId) {
      throw createError('UNAUTHORIZED');
    }

    await dependencies.rateLimit(`report-real-estate-review:${userId}`, 'sensitive');

    const payload = reportRealEstateReviewActionSchema.parse(input) as ReportRealEstateReviewInput;

    return dependencies.repository.reportRealEstateReview(payload);
  };
};
