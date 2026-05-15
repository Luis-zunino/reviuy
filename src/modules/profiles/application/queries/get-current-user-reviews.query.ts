import type { VoidQueryHandler } from '@/shared/kernel/contracts';
import type { GetCurrentUserReviewsOutput, ProfileReadRepository } from '../../domain';

export interface GetCurrentUserReviewsQueryDependencies {
  profileReadRepository: ProfileReadRepository;
}

export const createGetCurrentUserReviewsQuery = (
  dependencies: GetCurrentUserReviewsQueryDependencies
): VoidQueryHandler<GetCurrentUserReviewsOutput> => {
  const { profileReadRepository } = dependencies;

  return async (): Promise<GetCurrentUserReviewsOutput> => {
    return profileReadRepository.getCurrentUserReviews();
  };
};
