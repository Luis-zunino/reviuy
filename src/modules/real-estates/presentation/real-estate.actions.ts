'use server';

import { createCreateRealEstateUseCase } from '../application';
import { CreateRealEstateInput } from '../domain';
import { SupabaseRealEstateCommandRepository } from '../infrastructure';
import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';

export const createRealEstateAction = async (input: CreateRealEstateInput) => {
  const { supabase, getCurrentUserId, rateLimit } = await createServerActionDeps();

  const createRealEstateUseCase = createCreateRealEstateUseCase({
    getCurrentUserId,
    rateLimit,
    repository: new SupabaseRealEstateCommandRepository(supabase),
  });

  return createRealEstateUseCase(input);
};
