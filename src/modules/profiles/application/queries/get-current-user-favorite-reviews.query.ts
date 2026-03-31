import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetCurrentUserFavoriteReviewsOutput, ProfileReadRepository } from '../../domain';

export interface GetCurrentUserFavoriteReviewsQueryDependencies {
  profileReadRepository: ProfileReadRepository;
}

export const createGetCurrentUserFavoriteReviewsQuery = (
  dependencies: GetCurrentUserFavoriteReviewsQueryDependencies
): QueryHandler<Record<string, never>, GetCurrentUserFavoriteReviewsOutput> => {
  const { profileReadRepository } = dependencies;

  return async (): Promise<GetCurrentUserFavoriteReviewsOutput> => {
    return profileReadRepository.getCurrentUserFavoriteReviews();
  };
};
