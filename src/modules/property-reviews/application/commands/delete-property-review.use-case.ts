import type { UseCaseHandler } from '@/shared/kernel/contracts';
import {
  type DeletePropertyReviewInput,
  type DeletePropertyReviewResult,
  type PropertyReviewCommandRepository,
} from '../../domain';
import { RateLimitType } from '@/lib';

type RateLimitFunction = (key: string, scope: RateLimitType) => Promise<void>;
type GetCurrentUserIdFunction = () => Promise<string | null>;

export interface DeletePropertyReviewDependencies {
  getCurrentUserId: GetCurrentUserIdFunction;
  rateLimit: RateLimitFunction;
  propertyReviewCommandRepository: PropertyReviewCommandRepository;
}

export const createDeletePropertyReviewUseCase = (
  dependencies: DeletePropertyReviewDependencies
): UseCaseHandler<DeletePropertyReviewInput, DeletePropertyReviewResult> => {
  const { getCurrentUserId, rateLimit, propertyReviewCommandRepository } = dependencies;

  return async (input: DeletePropertyReviewInput): Promise<DeletePropertyReviewResult> => {
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
    await rateLimit(`delete-review:${userId}`, 'write');

    // 3. Delegación a infraestructura (que verificará ownership)
    return propertyReviewCommandRepository.delete(input);
  };
};
