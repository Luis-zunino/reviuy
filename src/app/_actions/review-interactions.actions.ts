'use server';

import { VoteType } from '@/types';
import {
  createVotePropertyReviewUseCase,
  createToggleFavoritePropertyReviewUseCase,
  SupabasePropertyReviewCommandRepository,
} from '@/modules/property-reviews';
import { createModerationDeps } from './utils';

// ============================================================================
// VOTE REVIEW ACTION
// ============================================================================

export async function voteReviewAction(reviewId: string, voteType: VoteType) {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const votePropertyReviewUseCase = createVotePropertyReviewUseCase({
    getCurrentUserId,
    rateLimit,
    propertyReviewCommandRepository: new SupabasePropertyReviewCommandRepository(supabase),
  });

  return votePropertyReviewUseCase({ reviewId, voteType });
}

// ============================================================================
// TOGGLE FAVORITE REVIEW ACTION
// ============================================================================

export async function toggleFavoriteReviewAction(reviewId: string) {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const toggleFavoritePropertyReviewUseCase = createToggleFavoritePropertyReviewUseCase({
    getCurrentUserId,
    rateLimit,
    propertyReviewCommandRepository: new SupabasePropertyReviewCommandRepository(supabase),
  });

  return toggleFavoritePropertyReviewUseCase({ reviewId });
}
