import type { QueryHandler } from '@/shared/kernel/contracts';
import type { HasUserReportedReviewInput, PropertyReviewReadRepository } from '../../domain';

export interface HasUserReportedReviewDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createHasUserReportedReviewQuery = (
  dependencies: HasUserReportedReviewDependencies
): QueryHandler<HasUserReportedReviewInput, boolean> => {
  const { propertyReviewReadRepository } = dependencies;

  return async (input: HasUserReportedReviewInput): Promise<boolean> => {
    return propertyReviewReadRepository.hasUserReportedReview(input);
  };
};
