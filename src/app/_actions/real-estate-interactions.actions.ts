'use server';

import { z } from 'zod';
import { withRateLimit, createError, handleSupabaseError } from '@/lib';
import { VoteType } from '@/types';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const voteTypeSchema = z.nativeEnum(VoteType);

export async function voteRealEstateAction(realEstateId: string, voteType: VoteType) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  voteTypeSchema.parse(voteType);

  // 🔥 RATE LIMIT
  await withRateLimit(`vote-real-estate:${user.id}`, 'vote');

  const { data, error } = await supabase.rpc('vote_real_estate', {
    p_real_estate_id: realEstateId,
    p_vote_type: voteType,
  });

  if (error) {
    throw handleSupabaseError(error);
  }

  return data;
}

export async function voteRealEstateReviewAction(reviewId: string, voteType: VoteType) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  voteTypeSchema.parse(voteType);

  // 🔥 RATE LIMIT
  await withRateLimit(`vote-re-review:${user.id}`, 'vote');

  const { data, error } = await supabase.rpc('vote_real_estate_review', {
    p_real_estate_review_id: reviewId,
    p_vote_type: voteType,
  });

  if (error) {
    throw handleSupabaseError(error);
  }

  return data;
}

export async function toggleFavoriteRealEstateAction(realEstateId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  // 🔥 RATE LIMIT
  await withRateLimit(`favorite-real-estate:${user.id}`, 'vote');

  const { data, error } = await supabase.rpc('toggle_favorite_real_estate', {
    p_real_estate_id: realEstateId,
  });

  if (error) {
    throw handleSupabaseError(error);
  }

  return data;
}
