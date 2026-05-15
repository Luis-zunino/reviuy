import { createError } from '@/lib';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import type { DeleteRealEstateReviewInput, DeleteRealEstateReviewOutput } from '../../domain';
import { RealEstateCommandoBase } from './interfaces';

/**
 * Creates a Use Case Handler to remove an existing real estate review.
 * It checks for a valid user session and applies rate limiting before proceeding.
 *
 * @param dependencies - Dependencies required to perform the deletion.
 * @returns A function that executes the review deletion via the repository.
 */
export const createDeleteRealEstateReviewUseCase = (
  dependencies: RealEstateCommandoBase
): UseCaseHandler<DeleteRealEstateReviewInput, DeleteRealEstateReviewOutput> => {
  return async (input) => {
    const userId = await dependencies.getCurrentUserId();

    if (!userId) {
      throw createError('UNAUTHORIZED');
    }

    await dependencies.rateLimit(`delete-re-review:${userId}`, 'write');

    return dependencies.repository.deleteReview(input);
  };
};
