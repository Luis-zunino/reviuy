'use server';

import { z } from 'zod';
import { VoteType } from '@/types';
import {
  createVoteRealEstateUseCase,
  createVoteRealEstateReviewUseCase,
  createToggleFavoriteRealEstateUseCase,
  SupabaseRealEstateCommandRepository,
} from '@/modules/real-estates';
import { createModerationDeps } from './utils';

const voteTypeSchema = z.enum(VoteType);

export async function voteRealEstateAction(realEstateId: string, voteType: VoteType) {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const voteRealEstateUseCase = createVoteRealEstateUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  voteTypeSchema.parse(voteType);

  return voteRealEstateUseCase({ realEstateId, voteType });
}

export async function voteRealEstateReviewAction(reviewId: string, voteType: VoteType) {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const voteRealEstateReviewUseCase = createVoteRealEstateReviewUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  voteTypeSchema.parse(voteType);

  return voteRealEstateReviewUseCase({ reviewId, voteType });
}

export async function toggleFavoriteRealEstateAction(realEstateId: string) {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const toggleFavoriteRealEstateUseCase = createToggleFavoriteRealEstateUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  return toggleFavoriteRealEstateUseCase({ realEstateId });
}
