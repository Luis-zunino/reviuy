import type { QueryHandler } from '@/shared/kernel/contracts';
import {
  type GetUserFavoriteReviewsInput,
  type GetUserFavoriteReviewsOutput,
  type PropertyReviewReadRepository,
} from '../../domain';

export interface GetUserFavoriteReviewsDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createGetUserFavoriteReviewsQuery = (
  dependencies: GetUserFavoriteReviewsDependencies
): QueryHandler<GetUserFavoriteReviewsInput, GetUserFavoriteReviewsOutput> => {
  const { propertyReviewReadRepository } = dependencies;

  return async (input: GetUserFavoriteReviewsInput): Promise<GetUserFavoriteReviewsOutput> => {
    return propertyReviewReadRepository.getUserFavorites(input);
  };
};
