'use server';

import {
  createCreatePropertyReviewUseCase,
  createUpdatePropertyReviewUseCase,
  createDeletePropertyReviewUseCase,
} from '../application';
import { SupabasePropertyReviewCommandRepository } from '../infrastructure';
import type { CreatePropertyReviewInput } from '../domain';
import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';

export async function createReviewAction(input: CreatePropertyReviewInput) {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const createPropertyReviewUseCase = createCreatePropertyReviewUseCase({
    getCurrentUserId,
    rateLimit,
    propertyReviewCommandRepository: new SupabasePropertyReviewCommandRepository(supabase),
  });

  return createPropertyReviewUseCase(input);
}

export async function updateReviewAction(reviewId: string, updateData: unknown) {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

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

export async function deleteReviewAction(reviewId: string) {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const deletePropertyReviewUseCase = createDeletePropertyReviewUseCase({
    getCurrentUserId,
    rateLimit,
    propertyReviewCommandRepository: new SupabasePropertyReviewCommandRepository(supabase),
  });

  return deletePropertyReviewUseCase({ reviewId });
}
