import { z } from 'zod';
import { createError } from '@/lib';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { reportRealEstateApiSchema } from '@/schemas';
import type { ReportActionResponse, ReportRealEstateInput } from '../../domain';
import { ModerationCommandBase } from './interfaces';

const reportRealEstateActionSchema = reportRealEstateApiSchema
  .omit({ realEstateName: true, message: true })
  .extend({
    real_estate_id: z.string().uuid('El identificador de inmobiliaria no es valido'),
    description: z
      .string()
      .trim()
      .max(2000, 'El mensaje no puede superar 2000 caracteres')
      .optional(),
  });

export const createReportRealEstateUseCase = (
  dependencies: ModerationCommandBase
): UseCaseHandler<unknown, ReportActionResponse> => {
  return async (input) => {
    const userId = await dependencies.getCurrentUserId();

    if (!userId) {
      throw createError('UNAUTHORIZED');
    }

    await dependencies.rateLimit(`report-real-estate:${userId}`, 'sensitive');

    const payload = reportRealEstateActionSchema.parse(input) as ReportRealEstateInput;

    return dependencies.repository.reportRealEstate(payload);
  };
};
