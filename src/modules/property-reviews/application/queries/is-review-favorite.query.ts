import type { QueryHandler } from '@/shared/kernel/contracts';
import {
  type IsReviewFavoriteInput,
  type IsReviewFavoriteOutput,
  type PropertyReviewReadRepository,
} from '../../domain';

export interface IsReviewFavoriteDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createIsReviewFavoriteQuery = (
  dependencies: IsReviewFavoriteDependencies
): QueryHandler<IsReviewFavoriteInput, IsReviewFavoriteOutput> => {
  const { propertyReviewReadRepository } = dependencies;

  return async (input: IsReviewFavoriteInput): Promise<IsReviewFavoriteOutput> => {
    return propertyReviewReadRepository.isFavorite(input);
  };
};
