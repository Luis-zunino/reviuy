import type { QueryHandler } from '@/shared/kernel/contracts';
import {
  type GetReviewByIdInput,
  type GetReviewByIdOutput,
  type PropertyReviewReadRepository,
} from '../../domain';

export interface GetReviewByIdDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createGetReviewByIdQuery = (
  dependencies: GetReviewByIdDependencies
): QueryHandler<GetReviewByIdInput, GetReviewByIdOutput> => {
  const { propertyReviewReadRepository } = dependencies;

  return async (input: GetReviewByIdInput): Promise<GetReviewByIdOutput> => {
    return propertyReviewReadRepository.getById(input);
  };
};
