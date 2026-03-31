import type { QueryHandler } from '@/shared/kernel/contracts';
import type {
  HasUserReportedReviewInput,
  HasUserReportedReviewOutput,
  PropertyReviewReadRepository,
} from '../../domain';

export interface HasUserReportedReviewDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createHasUserReportedReviewQuery = (
  dependencies: HasUserReportedReviewDependencies
): QueryHandler<HasUserReportedReviewInput, HasUserReportedReviewOutput> => {
  const { propertyReviewReadRepository } = dependencies;

  return async (input: HasUserReportedReviewInput): Promise<HasUserReportedReviewOutput> => {
    return propertyReviewReadRepository.hasUserReportedReview(input);
  };
};
