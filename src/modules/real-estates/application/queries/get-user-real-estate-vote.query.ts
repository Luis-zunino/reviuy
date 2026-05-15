import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetUserRealEstateVoteInput, GetUserRealEstateVoteOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

/**
 * Creates a Query Handler to check the current user's vote status for a specific real estate agency.
 *
 * @param dependencies - Dependencies required for the query, including the read repository.
 * @returns An asynchronous function that returns the vote type (like/dislike) if the user has voted.
 */
export const createGetUserRealEstateVoteQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetUserRealEstateVoteInput, GetUserRealEstateVoteOutput> => {
  const { repository } = dependencies;

  return async (input: GetUserRealEstateVoteInput): Promise<GetUserRealEstateVoteOutput> => {
    return repository.getUserVote(input);
  };
};
