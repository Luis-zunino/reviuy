import type { QueryHandler } from '@/shared/kernel/contracts';
import {
  type GetReviewsByRealEstateIdInput,
  type GetReviewsByRealEstateIdOutput,
  type PropertyReviewReadRepository,
} from '../../domain';

export interface GetReviewsByRealEstateIdDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createGetReviewsByRealEstateIdQuery = (
  dependencies: GetReviewsByRealEstateIdDependencies
): QueryHandler<GetReviewsByRealEstateIdInput, GetReviewsByRealEstateIdOutput> => {
  const { propertyReviewReadRepository } = dependencies;

  return async (input: GetReviewsByRealEstateIdInput): Promise<GetReviewsByRealEstateIdOutput> => {
    return propertyReviewReadRepository.getByRealEstateId(input);
  };
};
