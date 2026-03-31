'use server';

import {
  createCreateRealEstateUseCase,
  SupabaseRealEstateCommandRepository,
} from '@/modules/real-estates';
import { createModerationDeps } from './utils';

export async function createRealEstateAction(input: unknown) {
  const { supabase, getCurrentUserId, rateLimit } = await createModerationDeps();

  const createRealEstateUseCase = createCreateRealEstateUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  return createRealEstateUseCase(input);
}
