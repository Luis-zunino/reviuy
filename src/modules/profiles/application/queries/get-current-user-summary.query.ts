import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetCurrentUserSummaryOutput, ProfileReadRepository } from '../../domain';

export interface GetCurrentUserSummaryQueryDependencies {
  profileReadRepository: ProfileReadRepository;
}

export const createGetCurrentUserSummaryQuery = (
  dependencies: GetCurrentUserSummaryQueryDependencies
): QueryHandler<Record<string, never>, GetCurrentUserSummaryOutput> => {
  const { profileReadRepository } = dependencies;

  return async (): Promise<GetCurrentUserSummaryOutput> => {
    const [reviews, favoriteReviews, favoriteRealEstates] = await Promise.all([
      profileReadRepository.getCurrentUserReviews(),
      profileReadRepository.getCurrentUserFavoriteReviews(),
      profileReadRepository.getCurrentUserFavoriteRealEstates(),
    ]);

    return {
      reviews,
      favoriteReviews,
      favoriteRealEstates,
      stats: {
        reviewsCount: reviews?.length ?? 0,
        favoriteReviewsCount: favoriteReviews.length,
        favoriteRealEstatesCount: favoriteRealEstates.length,
      },
    };
  };
};
