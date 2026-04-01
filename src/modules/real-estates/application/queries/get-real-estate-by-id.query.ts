import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetRealEstateByIdInput, GetRealEstateByIdOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

/**
 * Creates a Query Handler to retrieve a specific real estate agency by its unique identifier.
 *
 * @param dependencies - Dependencies required for the query, including the read repository.
 * @returns An asynchronous function that takes the real estate ID and returns the agency details.
 */
export const createGetRealEstateByIdQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetRealEstateByIdInput, GetRealEstateByIdOutput> => {
  const { repository } = dependencies;

  return async (input: GetRealEstateByIdInput): Promise<GetRealEstateByIdOutput> => {
    return repository.getById(input);
  };
};
