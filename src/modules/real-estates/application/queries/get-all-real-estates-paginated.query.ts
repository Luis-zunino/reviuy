import type { QueryHandler } from '@/shared/kernel/contracts';
import type {
  GetAllRealEstatesPaginatedInput,
  GetAllRealEstatesPaginatedOutput,
} from '../../domain';
import { RealEstateQueryBase } from './interfaces';

/**
 * Creates a Query Handler to retrieve a paginated list of real estate agencies, optionally filtered by search or rating.
 *
 * @param dependencies - Dependencies required for the query, including the read repository.
 * @returns An asynchronous function that executes the paginated search and returns the results.
 */
export const createGetAllRealEstatesPaginatedQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetAllRealEstatesPaginatedInput, GetAllRealEstatesPaginatedOutput> => {
  const { repository } = dependencies;

  return async (
    input: GetAllRealEstatesPaginatedInput
  ): Promise<GetAllRealEstatesPaginatedOutput> =>
    repository.getRealEstatesWithVotesPaginated(input);
};
