import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { z } from 'zod';
import {
  type ToggleFavoritePropertyReviewInput,
  type ToggleFavoritePropertyReviewResult,
  type PropertyReviewCommandRepository,
} from '../../domain';
import { RateLimitType } from '@/lib';

type RateLimitFunction = (key: string, scope: RateLimitType) => Promise<void>;
type GetCurrentUserIdFunction = () => Promise<string | null>;

export interface ToggleFavoritePropertyReviewDependencies {
  getCurrentUserId: GetCurrentUserIdFunction;
  rateLimit: RateLimitFunction;
  propertyReviewCommandRepository: PropertyReviewCommandRepository;
}

export const createToggleFavoritePropertyReviewUseCase = (
  dependencies: ToggleFavoritePropertyReviewDependencies
): UseCaseHandler<ToggleFavoritePropertyReviewInput, ToggleFavoritePropertyReviewResult> => {
  const { getCurrentUserId, rateLimit, propertyReviewCommandRepository } = dependencies;

  return async (
    input: ToggleFavoritePropertyReviewInput
  ): Promise<ToggleFavoritePropertyReviewResult> => {
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
    await rateLimit(`favorite-review:${userId}`, 'vote');

    // 3. Validación básica
    z.string().uuid('El identificador de reseña no es válido').parse(input.reviewId);

    // 4. Delegación a infraestructura
    return propertyReviewCommandRepository.toggleFavorite(input);
  };
};
