'use server';

import { z } from 'zod';
import { withRateLimit, createError, handleSupabaseError } from '@/lib';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { VoteType } from '@/types';

const voteTypeSchema = z.nativeEnum(VoteType);

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

  voteTypeSchema.parse(voteType);

  // 🔥 RATE LIMIT
  await withRateLimit(`vote-review:${user.id}`, 'vote');

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

  z.string().uuid('El identificador de reseña no es válido').parse(reviewId);

  // 🔥 RATE LIMIT
  await withRateLimit(`favorite-review:${user.id}`, 'vote');

  const { data, error } = await supabase.rpc('toggle_favorite_review', {
    p_review_id: reviewId,
  });

  if (error) {
    throw handleSupabaseError(error);
  }

  return data;
}
