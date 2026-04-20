import type { QueryHandler } from '@/shared/kernel/contracts';
import type { HasUserReportedRealEstateInput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

/**
 * Creates a Query Handler to check if the current user has already reported a specific real estate agency.
 *
 * @param dependencies - Dependencies required for the query, including the read repository.
 * @returns An asynchronous function that returns a boolean indicating if a report exists.
 */
export const createHasUserReportedRealEstateQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<HasUserReportedRealEstateInput, boolean> => {
  const { repository } = dependencies;

  return async (input: HasUserReportedRealEstateInput): Promise<boolean> => {
    return repository.hasUserReported(input);
  };
};
