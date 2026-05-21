import type { VoidQueryHandler } from '@/shared/kernel/contracts/query.contract';
import type { GetCurrentUserFavoriteReviewsOutput, ProfileReadRepository } from '../../domain';

export interface GetCurrentUserFavoriteReviewsQueryDependencies {
  profileReadRepository: ProfileReadRepository;
}

export const createGetCurrentUserFavoriteReviewsQuery = (
  dependencies: GetCurrentUserFavoriteReviewsQueryDependencies
): VoidQueryHandler<GetCurrentUserFavoriteReviewsOutput> => {
  const { profileReadRepository } = dependencies;

  return async (): Promise<GetCurrentUserFavoriteReviewsOutput> => {
    return profileReadRepository.getCurrentUserFavoriteReviews();
  };
};
