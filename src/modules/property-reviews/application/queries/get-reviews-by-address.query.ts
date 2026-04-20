import { createError } from '@/lib';
import type { QueryHandler } from '@/shared/kernel/contracts';
import { z, ZodError } from 'zod';
import type {
  GetReviewsByAddressInput,
  ReviewWithVotesPublic,
  PropertyReviewReadRepository,
} from '../../domain';

const getReviewsByAddressSchema = z.object({
  osmId: z.string().min(1, 'El identificador de dirección es requerido'),
});

export interface GetReviewsByAddressQueryDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createGetReviewsByAddressQuery = (
  dependencies: GetReviewsByAddressQueryDependencies
): QueryHandler<GetReviewsByAddressInput, ReviewWithVotesPublic[]> => {
  return async (input) => {
    try {
      getReviewsByAddressSchema.parse(input);
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

    return dependencies.propertyReviewReadRepository.getByAddress(input);
  };
};
