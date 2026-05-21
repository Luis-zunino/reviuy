'use server';

import { revalidatePath } from 'next/cache';
import { VoteType } from '@/types/vote-type';
import {
  createVotePropertyReviewUseCase,
  createToggleFavoritePropertyReviewUseCase,
} from '../application';
import { SupabasePropertyReviewCommandRepository } from '../infrastructure';
import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';
import { createError } from '@/lib/errors';

export async function voteReviewAction(reviewId: string, voteType: VoteType, path?: string) {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw createError('UNAUTHORIZED', 'Debés iniciar sesión.');

  const votePropertyReviewUseCase = createVotePropertyReviewUseCase({
    getCurrentUserId,
    rateLimit,
    propertyReviewCommandRepository: new SupabasePropertyReviewCommandRepository(supabase),
  });

  const result = await votePropertyReviewUseCase({ reviewId, voteType });

  if (path) revalidatePath(path);

  return result;
}

export async function toggleFavoriteReviewAction(reviewId: string) {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw createError('UNAUTHORIZED', 'Debés iniciar sesión.');

  const toggleFavoritePropertyReviewUseCase = createToggleFavoritePropertyReviewUseCase({
    getCurrentUserId,
    rateLimit,
    propertyReviewCommandRepository: new SupabasePropertyReviewCommandRepository(supabase),
  });

  return toggleFavoritePropertyReviewUseCase({ reviewId });
}
