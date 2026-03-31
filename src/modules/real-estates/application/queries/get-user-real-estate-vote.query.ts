import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetUserRealEstateVoteInput, GetUserRealEstateVoteOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createGetUserRealEstateVoteQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetUserRealEstateVoteInput, GetUserRealEstateVoteOutput> => {
  const { repository } = dependencies;

  return async (input: GetUserRealEstateVoteInput): Promise<GetUserRealEstateVoteOutput> => {
    return repository.getUserVote(input);
  };
};
