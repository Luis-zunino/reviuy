import { type GetUserFavoriteReviewsOutput, type PropertyReviewReadRepository } from '../../domain';

export interface GetUserFavoriteReviewsDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createGetUserFavoriteReviewsQuery = (
  dependencies: GetUserFavoriteReviewsDependencies
): (() => Promise<GetUserFavoriteReviewsOutput>) => {
  const { propertyReviewReadRepository } = dependencies;

  return async (): Promise<GetUserFavoriteReviewsOutput> => {
    return propertyReviewReadRepository.getUserFavorites();
  };
};
