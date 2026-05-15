import type { QueryHandler } from '@/shared/kernel/contracts';
import { type IsReviewFavoriteInput, type PropertyReviewReadRepository } from '../../domain';

export interface IsReviewFavoriteDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createIsReviewFavoriteQuery = (
  dependencies: IsReviewFavoriteDependencies
): QueryHandler<IsReviewFavoriteInput, boolean> => {
  const { propertyReviewReadRepository } = dependencies;

  return async (input: IsReviewFavoriteInput): Promise<boolean> => {
    return propertyReviewReadRepository.isFavorite(input);
  };
};
