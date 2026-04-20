import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { backendReviewSchema } from '@/schemas';
import {
  type UpdatePropertyReviewInput,
  type UpdatePropertyReviewResult,
  type PropertyReviewCommandRepository,
} from '../../domain';
import { RateLimitType } from '@/lib';

type RateLimitFunction = (key: string, scope: RateLimitType) => Promise<void>;
type GetCurrentUserIdFunction = () => Promise<string | null>;

export interface UpdatePropertyReviewDependencies {
  getCurrentUserId: GetCurrentUserIdFunction;
  rateLimit: RateLimitFunction;
  propertyReviewCommandRepository: PropertyReviewCommandRepository;
}

export const createUpdatePropertyReviewUseCase = (
  dependencies: UpdatePropertyReviewDependencies
): UseCaseHandler<UpdatePropertyReviewInput, UpdatePropertyReviewResult> => {
  const { getCurrentUserId, rateLimit, propertyReviewCommandRepository } = dependencies;

  return async (input: UpdatePropertyReviewInput): Promise<UpdatePropertyReviewResult> => {
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
    await rateLimit(`update-review:${userId}`, 'write');

    // 3. Validación
    const { reviewId, ...updateData } = input;
    try {
      backendReviewSchema.partial().parse(updateData);
    } catch {
      return {
        success: false,
        message: 'Datos inválidos',
        error: 'VALIDATION_ERROR',
      };
    }

    // 4. Delegación a infraestructura
    return propertyReviewCommandRepository.update({
      reviewId,
      ...updateData,
    });
  };
};
