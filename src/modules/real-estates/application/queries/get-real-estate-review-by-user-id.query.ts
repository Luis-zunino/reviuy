import type { QueryHandler } from '@/shared/kernel/contracts';
import type {
  GetRealEstateReviewByUserIdInput,
  GetRealEstateReviewByUserIdOutput,
} from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createGetRealEstateReviewByUserIdQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetRealEstateReviewByUserIdInput, GetRealEstateReviewByUserIdOutput> => {
  const { repository } = dependencies;

  return async (
    input: GetRealEstateReviewByUserIdInput
  ): Promise<GetRealEstateReviewByUserIdOutput> => {
    return repository.getReviewByUserId(input);
  };
};
