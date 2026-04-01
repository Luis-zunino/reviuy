import { createError } from '@/lib';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { z } from 'zod';
import { type VoteRealEstateReviewInput, type VoteRealEstateReviewOutput } from '../../domain';
import { RealEstateCommandoBase } from './interfaces';
import { VoteType } from '@/types';

const voteRealEstateReviewInputSchema = z.object({
  reviewId: z.string().uuid('El identificador de resena no es valido'),
  voteType: z.enum([VoteType.LIKE, VoteType.DISLIKE]),
});

/**
 * Creates a Use Case Handler to cast a vote (Like or Dislike) on a specific real estate review.
 * Ensures the vote type is valid and applies rate limiting specific to
 * interaction/voting patterns.
 *
 * @param dependencies - Dependencies for handling review interactions and rate limiting.
 * @returns A function that registers the user's vote in the repository.
 */
export const createVoteRealEstateReviewUseCase = (
  dependencies: RealEstateCommandoBase
): UseCaseHandler<VoteRealEstateReviewInput, VoteRealEstateReviewOutput> => {
  return async (input) => {
    const userId = await dependencies.getCurrentUserId();

    if (!userId) {
      throw createError('UNAUTHORIZED');
    }

    await dependencies.rateLimit(`vote-re-review:${userId}`, 'vote');

    voteRealEstateReviewInputSchema.parse({
      reviewId: input.reviewId,
      voteType: input.voteType,
    });

    return dependencies.repository.voteReview(input);
  };
};
