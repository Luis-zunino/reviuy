import type { QueryHandler } from '@/shared/kernel/contracts/query.contract';
import type {
  GetUserRealEstateReviewVoteInput,
  GetUserRealEstateReviewVoteOutput,
} from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createGetUserRealEstateReviewVoteQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetUserRealEstateReviewVoteInput, GetUserRealEstateReviewVoteOutput> => {
  const { repository } = dependencies;

  return async (
    input: GetUserRealEstateReviewVoteInput
  ): Promise<GetUserRealEstateReviewVoteOutput> => {
    return repository.getUserReviewVote(input);
  };
};
