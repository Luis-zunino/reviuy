import { createError } from '@/lib';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import type { DeleteRealEstateReviewInput, DeleteRealEstateReviewOutput } from '../../domain';
import { RealEstateCommandoBase } from './interfaces';

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
