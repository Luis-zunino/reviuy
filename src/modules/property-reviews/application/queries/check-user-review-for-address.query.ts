import type { QueryHandler } from '@/shared/kernel/contracts';
import {
  type CheckUserReviewForAddressInput,
  type CheckUserReviewForAddressOutput,
  type PropertyReviewReadRepository,
} from '../../domain';

export interface CheckUserReviewForAddressDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createCheckUserReviewForAddressQuery = (
  dependencies: CheckUserReviewForAddressDependencies
): QueryHandler<CheckUserReviewForAddressInput, CheckUserReviewForAddressOutput> => {
  const { propertyReviewReadRepository } = dependencies;

  return async (
    input: CheckUserReviewForAddressInput
  ): Promise<CheckUserReviewForAddressOutput> => {
    return propertyReviewReadRepository.checkUserReviewForAddress(input);
  };
};
