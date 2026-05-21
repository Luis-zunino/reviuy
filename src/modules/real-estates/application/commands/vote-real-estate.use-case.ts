import { assertAuthenticated } from '@/shared/auth/assert-authenticated.util';
import type { UseCaseHandler } from '@/shared/kernel/contracts/use-case.contract';
import { z } from 'zod';
import { type VoteRealEstateInput, type VoteRealEstateOutput } from '../../domain';
import { RealEstateCommandoBase } from './interfaces';
import { VoteType } from '@/types/vote-type';

const voteRealEstateInputSchema = z.object({
  realEstateId: z.string().uuid('El identificador de inmobiliaria no es valido'),
  voteType: z.enum([VoteType.LIKE, VoteType.DISLIKE]),
});

/**
 * Creates a Use Case Handler for a user to vote (Like or Dislike) on a real estate agency.
 * This interaction helps in calculating the overall reputation and trustworthiness of the agency.
 *
 * @param dependencies - Repository and access control dependencies.
 * @returns A function that processes the real estate vote.
 */
export const createVoteRealEstateUseCase = (
  dependencies: RealEstateCommandoBase
): UseCaseHandler<VoteRealEstateInput, VoteRealEstateOutput> => {
  return async (input) => {
    const userId = await assertAuthenticated(dependencies.getCurrentUserId);

    await dependencies.rateLimit(`vote-real-estate:${userId}`, 'vote');

    voteRealEstateInputSchema.parse({
      realEstateId: input.realEstateId,
      voteType: input.voteType,
    });

    return dependencies.repository.vote(input);
  };
};
