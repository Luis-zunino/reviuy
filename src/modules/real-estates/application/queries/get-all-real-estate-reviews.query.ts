import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetAllRealEstateReviewsInput, GetAllRealEstateReviewsOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

/**
 * Creates a Query Handler to retrieve all reviews for a specific real estate agency, with optional limit.
 *
 * @param dependencies - Dependencies required for the query, including the read repository.
 * @returns An asynchronous function that fetches reviews for the given real estate ID.
 */
export const createGetAllRealEstateReviewsQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetAllRealEstateReviewsInput, GetAllRealEstateReviewsOutput> => {
  const { repository } = dependencies;

  return async (input: GetAllRealEstateReviewsInput): Promise<GetAllRealEstateReviewsOutput> =>
    repository.getAllReviews(input);
};
