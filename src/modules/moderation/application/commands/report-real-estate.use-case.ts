import { z } from 'zod';
import { assertAuthenticated } from '@/shared/auth/assert-authenticated.util';
import type { UseCaseHandler } from '@/shared/kernel/contracts/use-case.contract';
import { reportRealEstateApiSchema } from '@/schemas/api-request.schema';
import type { ReportActionResponse } from '../../domain';
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
    const userId = await assertAuthenticated(dependencies.getCurrentUserId);

    await dependencies.rateLimit(`report-real-estate:${userId}`, 'sensitive');

    const payload = reportRealEstateActionSchema.parse(input);

    return dependencies.repository.reportRealEstate(payload);
  };
};
