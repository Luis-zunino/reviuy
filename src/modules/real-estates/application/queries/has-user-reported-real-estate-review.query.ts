import type { QueryHandler } from '@/shared/kernel/contracts';
import type { HasUserReportedRealEstateReviewInput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

/**
 * Creates a Query Handler to check if the current user has already reported a specific real estate review.
 *
 * @param dependencies - Dependencies required for the query, including the read repository.
 * @returns An asynchronous function that returns a boolean indicating if the review was reported by the user.
 */
export const createHasUserReportedRealEstateReviewQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<HasUserReportedRealEstateReviewInput, boolean> => {
  const { repository } = dependencies;

  return async (input: HasUserReportedRealEstateReviewInput): Promise<boolean> => {
    return repository.hasUserReportedReview(input);
  };
};
