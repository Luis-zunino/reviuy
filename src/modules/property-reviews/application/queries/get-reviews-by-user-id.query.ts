import type { QueryHandler } from '@/shared/kernel/contracts';
import {
  type GetReviewsByUserIdInput,
  type GetReviewsByUserIdOutput,
  type PropertyReviewReadRepository,
} from '../../domain';

export interface GetReviewsByUserIdDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createGetReviewsByUserIdQuery = (
  dependencies: GetReviewsByUserIdDependencies
): QueryHandler<GetReviewsByUserIdInput, GetReviewsByUserIdOutput> => {
  const { propertyReviewReadRepository } = dependencies;

  return async (): Promise<GetReviewsByUserIdOutput> => {
    return propertyReviewReadRepository.getByUserId();
  };
};
