import type { QueryHandler } from '@/shared/kernel/contracts';
import type { HasUserReportedRealEstateReviewInput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createHasUserReportedRealEstateReviewQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<HasUserReportedRealEstateReviewInput, boolean> => {
  const { repository } = dependencies;

  return async (input: HasUserReportedRealEstateReviewInput): Promise<boolean> => {
    return repository.hasUserReportedReview(input);
  };
};
