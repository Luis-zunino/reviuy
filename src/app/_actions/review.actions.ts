'use server';

import { CreateReviewData } from '@/services';
import {
  createCreatePropertyReviewUseCase,
  createUpdatePropertyReviewUseCase,
  createDeletePropertyReviewUseCase,
  SupabasePropertyReviewCommandRepository,
} from '@/modules/property-reviews';
import { createModerationDeps } from './utils';

// ============================================================================
// CREATE REVIEW ACTION
// ============================================================================

export async function createReviewAction(input: CreateReviewData) {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const createPropertyReviewUseCase = createCreatePropertyReviewUseCase({
    getCurrentUserId,
    rateLimit,
    propertyReviewCommandRepository: new SupabasePropertyReviewCommandRepository(supabase),
  });

  return createPropertyReviewUseCase(input);
}

// ============================================================================
// UPDATE REVIEW ACTION
// ============================================================================

export async function updateReviewAction(reviewId: string, updateData: unknown) {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const updatePropertyReviewUseCase = createUpdatePropertyReviewUseCase({
    getCurrentUserId,
    rateLimit,
    propertyReviewCommandRepository: new SupabasePropertyReviewCommandRepository(supabase),
  });

  return updatePropertyReviewUseCase({
    reviewId,
    ...(updateData as Record<string, unknown>),
  });
}

// ============================================================================
// DELETE REVIEW ACTION
// ============================================================================

export async function deleteReviewAction(reviewId: string) {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const deletePropertyReviewUseCase = createDeletePropertyReviewUseCase({
    getCurrentUserId,
    rateLimit,
    propertyReviewCommandRepository: new SupabasePropertyReviewCommandRepository(supabase),
  });

  return deletePropertyReviewUseCase({ reviewId });
}
