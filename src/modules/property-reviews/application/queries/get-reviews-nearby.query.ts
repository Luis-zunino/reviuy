import { createError } from '@/lib';
import type { QueryHandler } from '@/shared/kernel/contracts';
import { z, ZodError } from 'zod';
import type {
  GetReviewsNearbyInput,
  GetReviewsNearbyOutput,
  PropertyReviewReadRepository,
} from '../../domain';

const schema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  radiusDeg: z.number().positive().optional(),
  limit: z.number().int().positive().optional(),
});

export interface GetReviewsNearbyQueryDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createGetReviewsNearbyQuery = (
  dependencies: GetReviewsNearbyQueryDependencies
): QueryHandler<GetReviewsNearbyInput, GetReviewsNearbyOutput> => {
  return async (input) => {
    try {
      schema.parse(input);
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

    return dependencies.propertyReviewReadRepository.searchNearby(input);
  };
};
