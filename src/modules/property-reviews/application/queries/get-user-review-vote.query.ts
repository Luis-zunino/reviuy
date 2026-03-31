import type { QueryHandler } from '@/shared/kernel/contracts';
import {
  type GetUserReviewVoteInput,
  type GetUserReviewVoteOutput,
  type PropertyReviewReadRepository,
} from '../../domain';

export interface GetUserReviewVoteDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
}

export const createGetUserReviewVoteQuery = (
  dependencies: GetUserReviewVoteDependencies
): QueryHandler<GetUserReviewVoteInput, GetUserReviewVoteOutput> => {
  const { propertyReviewReadRepository } = dependencies;

  return async (input: GetUserReviewVoteInput): Promise<GetUserReviewVoteOutput> => {
    return propertyReviewReadRepository.getUserVote(input);
  };
};
