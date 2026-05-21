import type { VoidQueryHandler } from '@/shared/kernel/contracts/query.contract';
import { type GetReviewsByUserIdOutput, type PropertyReviewReadRepository } from '../../domain';

export interface GetReviewsByUserIdDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createGetReviewsByUserIdQuery = (
  dependencies: GetReviewsByUserIdDependencies
): VoidQueryHandler<GetReviewsByUserIdOutput> => {
  const { propertyReviewReadRepository } = dependencies;

  return async (): Promise<GetReviewsByUserIdOutput> => {
    return propertyReviewReadRepository.getByUserId();
  };
};
