'use server';

import { createAcceptTermsUseCase } from '../application';
import { SupabaseProfileCommandRepository } from '../infrastructure';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { RateLimitType, withRateLimit } from '@/lib/redis';

export const acceptTermsAction = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const acceptTermsUseCase = createAcceptTermsUseCase({
    getCurrentUserId: async () => {
      if (authError || !user) {
        return null;
      }

      return user.id;
    },
    rateLimit: async (key: string, scope: RateLimitType) => {
      await withRateLimit(key, scope);
    },
    profileCommandRepository: new SupabaseProfileCommandRepository(),
  });

  return acceptTermsUseCase({});
};
