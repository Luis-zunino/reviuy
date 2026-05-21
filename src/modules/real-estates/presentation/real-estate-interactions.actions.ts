'use server';

import { z } from 'zod';
import { VoteType } from '@/types/vote-type';
import {
  createVoteRealEstateUseCase,
  createVoteRealEstateReviewUseCase,
  createToggleFavoriteRealEstateUseCase,
} from '../application';
import { SupabaseRealEstateCommandRepository } from '../infrastructure';
import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';
import { createError } from '@/lib/errors';

const voteTypeSchema = z.enum(VoteType);

export const voteRealEstateAction = async (realEstateId: string, voteType: VoteType) => {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw createError('UNAUTHORIZED', 'Debés iniciar sesión.');

  const voteRealEstateUseCase = createVoteRealEstateUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  voteTypeSchema.parse(voteType);

  return voteRealEstateUseCase({ realEstateId, voteType });
};

export const voteRealEstateReviewAction = async (reviewId: string, voteType: VoteType) => {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw createError('UNAUTHORIZED', 'Debés iniciar sesión.');

  const voteRealEstateReviewUseCase = createVoteRealEstateReviewUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  voteTypeSchema.parse(voteType);

  return voteRealEstateReviewUseCase({ reviewId, voteType });
};

export const toggleFavoriteRealEstateAction = async (realEstateId: string) => {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw createError('UNAUTHORIZED', 'Debés iniciar sesión.');

  const toggleFavoriteRealEstateUseCase = createToggleFavoriteRealEstateUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  return toggleFavoriteRealEstateUseCase({ realEstateId });
};
