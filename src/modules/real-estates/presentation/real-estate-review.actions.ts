'use server';

import {
  createCreateRealEstateReviewUseCase,
  createUpdateRealEstateReviewUseCase,
  createDeleteRealEstateReviewUseCase,
} from '../application';
import { SupabaseRealEstateCommandRepository } from '../infrastructure';
import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';

export async function createRealEstateReviewAction(input: unknown) {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const createRealEstateReviewUseCase = createCreateRealEstateReviewUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  return createRealEstateReviewUseCase(input);
}

export async function updateRealEstateReviewAction(reviewId: string, updateData: unknown) {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const updateRealEstateReviewUseCase = createUpdateRealEstateReviewUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  return updateRealEstateReviewUseCase({
    reviewId,
    ...(updateData as Record<string, unknown>),
  });
}

export async function deleteRealEstateReviewAction(reviewId: string) {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const deleteRealEstateReviewUseCase = createDeleteRealEstateReviewUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  return deleteRealEstateReviewUseCase({ reviewId });
}
