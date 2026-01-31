'use server';

import { withRateLimit, createError, handleSupabaseError } from '@/lib';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { VoteType } from '@/types';

// ============================================================================
// VOTE REVIEW ACTION
// ============================================================================

export async function voteReviewAction(reviewId: string, voteType: VoteType) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  // 🔥 RATE LIMIT
  const allowed = await withRateLimit(`vote-review:${user.id}`, 'vote');
  if (!allowed) {
    throw createError('RATE_LIMIT');
  }

  const { data, error } = await supabase.rpc('vote_review', {
    p_review_id: reviewId,
    p_vote_type: voteType,
  });

  if (error) {
    throw handleSupabaseError(error);
  }

  return data;
}

// ============================================================================
// TOGGLE FAVORITE REVIEW ACTION
// ============================================================================

export async function toggleFavoriteReviewAction(reviewId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  // 🔥 RATE LIMIT
  const allowed = await withRateLimit(`favorite-review:${user.id}`, 'vote');
  if (!allowed) {
    throw createError('RATE_LIMIT');
  }

  const { data, error } = await supabase.rpc('toggle_favorite_review', {
    p_review_id: reviewId,
  });

  if (error) {
    throw handleSupabaseError(error);
  }

  return data;
}
