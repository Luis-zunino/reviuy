import { createError } from '@/lib';
import { createRealEstateReviewSchema } from '@/schemas';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { ZodError } from 'zod';
import type { CreateRealEstateReviewInput, CreateRealEstateReviewOutput } from '../../domain';
import { RealEstateCommandoBase } from './interfaces';

/**
 * Creates a Use Case Handler to submit a new review for a real estate agency.
 * The process includes authentication verification, write-operation rate limiting,
 * and strict input validation using Zod.
 *
 * @param dependencies - Core dependencies including repository and session management.
 * @returns An asynchronous function that processes the review creation.
 */
export const createCreateRealEstateReviewUseCase = (
  dependencies: RealEstateCommandoBase
): UseCaseHandler<unknown, CreateRealEstateReviewOutput> => {
  return async (input) => {
    const userId = await dependencies.getCurrentUserId();

    if (!userId) {
      throw createError('UNAUTHORIZED');
    }

    await dependencies.rateLimit(`create-re-review:${userId}`, 'write');

    let validatedInput: CreateRealEstateReviewInput;

    try {
      validatedInput = createRealEstateReviewSchema.parse(input) as CreateRealEstateReviewInput;
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

    return dependencies.repository.createReview(validatedInput);
  };
};
