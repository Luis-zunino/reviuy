import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetUserFavoriteRealEstatesOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

/**
 * Creates a Query Handler to retrieve the list of real estate agencies
 * marked as favorites by the authenticated user.
 *
 * @param dependencies - Dependencies required for the query, including the read repository.
 * @returns An asynchronous function that executes the query and returns the favorite real estates.
 */
export const createGetUserFavoriteRealEstatesQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<Record<string, never>, GetUserFavoriteRealEstatesOutput> => {
  const { repository } = dependencies;

  return async (): Promise<GetUserFavoriteRealEstatesOutput> => {
    return repository.getUserFavorites();
  };
};
