import type { QueryHandler } from '@/shared/kernel/contracts';
import type { SearchRealEstatesInput, SearchRealEstatesOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

/**
 * Creates a Query Handler to search for real estate agencies by name with a limit on the number of results.
 *
 * @param dependencies - Dependencies required for the query, including the read repository.
 * @returns An asynchronous function that performs the text-based search.
 */
export const createSearchRealEstatesQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<SearchRealEstatesInput, SearchRealEstatesOutput> => {
  const { repository } = dependencies;

  return async (input: SearchRealEstatesInput): Promise<SearchRealEstatesOutput> => {
    return repository.search(input);
  };
};
