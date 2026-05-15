import type { VoidQueryHandler } from '@/shared/kernel/contracts';
import { type GetUserFavoriteReviewsOutput, type PropertyReviewReadRepository } from '../../domain';

export interface GetUserFavoriteReviewsDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createGetUserFavoriteReviewsQuery = (
  dependencies: GetUserFavoriteReviewsDependencies
): VoidQueryHandler<GetUserFavoriteReviewsOutput> => {
  const { propertyReviewReadRepository } = dependencies;

  return async (): Promise<GetUserFavoriteReviewsOutput> => {
    return propertyReviewReadRepository.getUserFavorites();
  };
};
