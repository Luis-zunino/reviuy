import { createError } from '@/lib';
import { formCreateRealEstateSchema } from '@/schemas';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { ZodError } from 'zod';
import type { CreateRealEstateInput, CreateRealEstateOutput } from '../../domain';
import { RealEstateCommandoBase } from './interfaces';

export const createCreateRealEstateUseCase = (
  dependencies: RealEstateCommandoBase
): UseCaseHandler<unknown, CreateRealEstateOutput> => {
  return async (input) => {
    const userId = await dependencies.getCurrentUserId();

    if (!userId) {
      throw createError('UNAUTHORIZED');
    }

    await dependencies.rateLimit(`create-real-estate:${userId}`, 'write');

    let validatedInput: CreateRealEstateInput;

    try {
      validatedInput = formCreateRealEstateSchema.parse(input) as CreateRealEstateInput;
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];
        throw createError(
          'VALIDATION_ERROR',
          `${firstError.path.join('.')}: ${firstError.message}`
        );
      }

      throw error;
    }

    return dependencies.repository.create(validatedInput);
  };
};
