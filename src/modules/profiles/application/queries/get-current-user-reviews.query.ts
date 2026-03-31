import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetCurrentUserReviewsOutput, ProfileReadRepository } from '../../domain';

export interface GetCurrentUserReviewsQueryDependencies {
  profileReadRepository: ProfileReadRepository;
}

export const createGetCurrentUserReviewsQuery = (
  dependencies: GetCurrentUserReviewsQueryDependencies
): QueryHandler<Record<string, never>, GetCurrentUserReviewsOutput> => {
  const { profileReadRepository } = dependencies;

  return async (): Promise<GetCurrentUserReviewsOutput> => {
    return profileReadRepository.getCurrentUserReviews();
  };
};
