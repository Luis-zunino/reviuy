import { createError } from '@/lib/errors';
import { assertAuthenticated } from '@/shared/auth/assert-authenticated.util';
import { formRealEstateSchema } from '@/schemas/real-estate-review.schema';
import type { UseCaseHandler } from '@/shared/kernel/contracts/use-case.contract';
import { ZodError } from 'zod';
import type { UpdateRealEstateReviewInput, UpdateRealEstateReviewOutput } from '../../domain';
import { RealEstateCommandoBase } from './interfaces';

/**
 * Creates a Use Case Handler to partially update an existing real estate review.
 * It allows modification of specific fields like rating or description while
 * ensuring the update adheres to domain validation rules.
 *
 * @param dependencies - Infrastructure dependencies for persistence and validation.
 * @returns A function that validates partial input and updates the review.
 */
export const createUpdateRealEstateReviewUseCase = (
  dependencies: RealEstateCommandoBase
): UseCaseHandler<UpdateRealEstateReviewInput, UpdateRealEstateReviewOutput> => {
  return async (input) => {
    const userId = await assertAuthenticated(dependencies.getCurrentUserId);

    await dependencies.rateLimit(`update-re-review:${userId}`, 'write');

    const { reviewId, ...data } = input;

    try {
      formRealEstateSchema.partial().parse(data);
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

    return dependencies.repository.updateReview({ reviewId, ...data });
  };
};
