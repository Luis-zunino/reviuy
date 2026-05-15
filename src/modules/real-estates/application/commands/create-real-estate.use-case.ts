import { createError } from '@/lib';
import { formCreateRealEstateSchema } from '@/schemas';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { ZodError } from 'zod';
import type { CreateRealEstateInput, RealEstate } from '../../domain';
import { RealEstateCommandoBase } from './interfaces';

/**
 * Creates a Use Case Handler to register a new real estate agency in the system.
 * Ensures that the user is authenticated and that the agency name meets
 * length and content requirements.
 *
 * @param dependencies - Infrastructure and domain dependencies required for the operation.
 * @returns A function that validates the input and delegates creation to the repository.
 */
export const createCreateRealEstateUseCase = (
  dependencies: RealEstateCommandoBase
): UseCaseHandler<unknown, RealEstate> => {
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
