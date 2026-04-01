import type { QueryHandler } from '@/shared/kernel/contracts';
import type { IsRealEstateFavoriteInput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

/**
 * Creates a Query Handler to check if a specific real estate agency is marked as a favorite by the user.
 *
 * @param dependencies - Dependencies required for the query, including the read repository.
 * @returns An asynchronous function that returns a boolean indicating favorite status.
 */
export const createIsRealEstateFavoriteQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<IsRealEstateFavoriteInput, boolean> => {
  const { repository } = dependencies;

  return async (input: IsRealEstateFavoriteInput): Promise<boolean> => {
    return repository.isFavorite(input);
  };
};
