'use server';

import {
  createCreateRealEstateReviewUseCase,
  createUpdateRealEstateReviewUseCase,
  createDeleteRealEstateReviewUseCase,
  SupabaseRealEstateCommandRepository,
} from '@/modules/real-estates';
import { createModerationDeps } from './utils';

// ============================================================================
// CREATE REAL ESTATE REVIEW ACTION
// ============================================================================

// Nota: input es 'unknown' intencionalmente. Nunca confiar en datos del cliente.
// Zod validará y convertirá a tipo seguro.
export async function createRealEstateReviewAction(input: unknown) {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const createRealEstateReviewUseCase = createCreateRealEstateReviewUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  return createRealEstateReviewUseCase(input);
}

// ============================================================================
// UPDATE REAL ESTATE REVIEW ACTION
// ============================================================================

export async function updateRealEstateReviewAction(reviewId: string, updateData: unknown) {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

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

// ============================================================================
// DELETE REAL ESTATE REVIEW ACTION
// ============================================================================

export async function deleteRealEstateReviewAction(reviewId: string) {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const deleteRealEstateReviewUseCase = createDeleteRealEstateReviewUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  return deleteRealEstateReviewUseCase({ reviewId });
}
