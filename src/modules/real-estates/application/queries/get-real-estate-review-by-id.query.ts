import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetRealEstateReviewByIdInput, GetRealEstateReviewByIdOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createGetRealEstateReviewByIdQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetRealEstateReviewByIdInput, GetRealEstateReviewByIdOutput> => {
  const { repository } = dependencies;

  return async (input: GetRealEstateReviewByIdInput): Promise<GetRealEstateReviewByIdOutput> => {
    return repository.getReviewById(input);
  };
};
