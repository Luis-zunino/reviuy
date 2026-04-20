import { createError } from '@/lib';
import type { QueryHandler } from '@/shared/kernel/contracts';
import { z, ZodError } from 'zod';
import type {
  GetReviewsByZoneInput,
  GetReviewsByZoneOutput,
  PropertyReviewReadRepository,
} from '../../domain';

const schema = z.object({
  query: z.string().min(1, 'La zona de búsqueda es requerida'),
  limit: z.number().int().positive().optional(),
});

export interface GetReviewsByZoneQueryDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createGetReviewsByZoneQuery = (
  dependencies: GetReviewsByZoneQueryDependencies
): QueryHandler<GetReviewsByZoneInput, GetReviewsByZoneOutput> => {
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

    return dependencies.propertyReviewReadRepository.searchByZone(input);
  };
};
