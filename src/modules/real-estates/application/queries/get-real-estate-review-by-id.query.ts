import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetRealEstateReviewByIdInput, GetRealEstateReviewByIdOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

/**
 * Creates a Query Handler to retrieve a specific real estate review by its unique identifier.
 *
 * @param dependencies - Dependencies required for the query, including the read repository.
 * @returns An asynchronous function that takes the review ID and returns the review details.
 */
export const createGetRealEstateReviewByIdQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetRealEstateReviewByIdInput, GetRealEstateReviewByIdOutput> => {
  const { repository } = dependencies;

  return async (input: GetRealEstateReviewByIdInput): Promise<GetRealEstateReviewByIdOutput> => {
    return repository.getReviewById(input);
  };
};
