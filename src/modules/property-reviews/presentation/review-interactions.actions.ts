'use server';

import { VoteType } from '@/types';
import {
  createVotePropertyReviewUseCase,
  createToggleFavoritePropertyReviewUseCase,
} from '../application';
import { SupabasePropertyReviewCommandRepository } from '../infrastructure';
import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';

export async function voteReviewAction(reviewId: string, voteType: VoteType) {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const votePropertyReviewUseCase = createVotePropertyReviewUseCase({
    getCurrentUserId,
    rateLimit,
    propertyReviewCommandRepository: new SupabasePropertyReviewCommandRepository(supabase),
  });

  return votePropertyReviewUseCase({ reviewId, voteType });
}

export async function toggleFavoriteReviewAction(reviewId: string) {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const toggleFavoritePropertyReviewUseCase = createToggleFavoritePropertyReviewUseCase({
    getCurrentUserId,
    rateLimit,
    propertyReviewCommandRepository: new SupabasePropertyReviewCommandRepository(supabase),
  });

  return toggleFavoritePropertyReviewUseCase({ reviewId });
}
