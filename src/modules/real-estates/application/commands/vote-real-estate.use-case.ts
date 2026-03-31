import { createError } from '@/lib';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { z } from 'zod';
import type { VoteRealEstateInput, VoteRealEstateOutput } from '../../domain';
import { RealEstateCommandoBase } from './interfaces';
import { VoteType } from '@/types';

const voteRealEstateInputSchema = z.object({
  realEstateId: z.string().uuid('El identificador de inmobiliaria no es valido'),
  voteType: z.enum([VoteType.LIKE, VoteType.DISLIKE]),
});

export const createVoteRealEstateUseCase = (
  dependencies: RealEstateCommandoBase
): UseCaseHandler<VoteRealEstateInput, VoteRealEstateOutput> => {
  return async (input) => {
    const userId = await dependencies.getCurrentUserId();

    if (!userId) {
      throw createError('UNAUTHORIZED');
    }

    await dependencies.rateLimit(`vote-real-estate:${userId}`, 'vote');

    voteRealEstateInputSchema.parse({
      realEstateId: input.realEstateId,
      voteType: input.voteType,
    });

    return dependencies.repository.vote(input);
  };
};
