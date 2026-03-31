import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetAllRealEstateReviewsInput, GetAllRealEstateReviewsOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createGetAllRealEstateReviewsQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetAllRealEstateReviewsInput, GetAllRealEstateReviewsOutput> => {
  const { repository } = dependencies;

  return async (input: GetAllRealEstateReviewsInput): Promise<GetAllRealEstateReviewsOutput> =>
    repository.getAllReviews(input);
};
