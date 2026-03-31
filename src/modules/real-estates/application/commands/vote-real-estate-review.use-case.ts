import { createError } from '@/lib';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { z } from 'zod';
import type { VoteRealEstateReviewInput, VoteRealEstateReviewOutput } from '../../domain';
import { RealEstateCommandoBase } from './interfaces';
import { VoteType } from '@/types';

const voteRealEstateReviewInputSchema = z.object({
  reviewId: z.string().uuid('El identificador de resena no es valido'),
  voteType: z.enum([VoteType.LIKE, VoteType.DISLIKE]),
});

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
