import { createError } from '@/lib/errors';
import { RateLimitType } from '@/lib/redis';
import { assertAuthenticated } from '@/shared/auth/assert-authenticated.util';
import { backendReviewSchema } from '@/schemas/review.schema';
import type { UseCaseHandler } from '@/shared/kernel/contracts/use-case.contract';
import { ZodError } from 'zod';
import type {
  CreatePropertyReviewInput,
  CreatePropertyReviewResult,
  PropertyReviewCommandRepository,
} from '../../domain';

export interface CreatePropertyReviewUseCaseDependencies {
  getCurrentUserId: () => Promise<string | null>;
  rateLimit: (key: string, scope: RateLimitType) => Promise<void>;
  propertyReviewCommandRepository: PropertyReviewCommandRepository;
}

const unwrapCreatePropertyReviewInput = (input: unknown): unknown => {
  if (typeof input !== 'object' || input === null || !('data' in input)) {
    return input;
  }

  const wrappedInput = input as { data?: unknown };
  return wrappedInput.data ?? input;
};

export const createCreatePropertyReviewUseCase = (
  dependencies: CreatePropertyReviewUseCaseDependencies
): UseCaseHandler<unknown, CreatePropertyReviewResult> => {
  return async (input) => {
    const userId = await assertAuthenticated(dependencies.getCurrentUserId);

    await dependencies.rateLimit(`create-review:${userId}`, 'write');

    let validatedInput: CreatePropertyReviewInput;

    try {
      validatedInput = backendReviewSchema.parse(unwrapCreatePropertyReviewInput(input));
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

    return dependencies.propertyReviewCommandRepository.create(validatedInput);
  };
};
