import type { QueryHandler } from '@/shared/kernel/contracts';
import type {
  GetRealEstateReviewByUserIdInput,
  GetRealEstateReviewByUserIdOutput,
} from '../../domain';
import { RealEstateQueryBase } from './interfaces';

/**
 * Creates a Query Handler to retrieve a review for a specific real estate agency written by the current user.
 *
 * @param dependencies - Dependencies required for the query, including the read repository.
 * @returns An asynchronous function that finds the user's review for the given real estate ID.
 */
export const createGetRealEstateReviewByUserIdQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetRealEstateReviewByUserIdInput, GetRealEstateReviewByUserIdOutput> => {
  const { repository } = dependencies;

  return async (
    input: GetRealEstateReviewByUserIdInput
  ): Promise<GetRealEstateReviewByUserIdOutput> => {
    return repository.getReviewByUserId(input);
  };
};
