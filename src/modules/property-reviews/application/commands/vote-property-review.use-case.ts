import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { z } from 'zod';
import {
  type VotePropertyReviewInput,
  type VotePropertyReviewResult,
  type PropertyReviewCommandRepository,
} from '../../domain';
import { RateLimitType } from '@/lib';

type RateLimitFunction = (key: string, scope: RateLimitType) => Promise<void>;
type GetCurrentUserIdFunction = () => Promise<string | null>;

export interface VotePropertyReviewDependencies {
  getCurrentUserId: GetCurrentUserIdFunction;
  rateLimit: RateLimitFunction;
  propertyReviewCommandRepository: PropertyReviewCommandRepository;
}

export const createVotePropertyReviewUseCase = (
  dependencies: VotePropertyReviewDependencies
): UseCaseHandler<VotePropertyReviewInput, VotePropertyReviewResult> => {
  const { getCurrentUserId, rateLimit, propertyReviewCommandRepository } = dependencies;

  return async (input: VotePropertyReviewInput): Promise<VotePropertyReviewResult> => {
    // 1. Autenticación
    const userId = await getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        message: 'No autorizado',
        error: 'UNAUTHORIZED',
      };
    }

    // 2. Rate limiting
    await rateLimit(`vote-review:${userId}`, 'vote');

    // 3. Validación básica
    z.string().uuid().parse(input.reviewId);

    // 4. Delegación a infraestructura
    return propertyReviewCommandRepository.vote(input);
  };
};
