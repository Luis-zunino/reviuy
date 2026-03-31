'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { RateLimitType, withRateLimit } from '@/lib';
import { createDeleteAccountUseCase } from '@/modules/profiles/application';
import { SupabaseProfileCommandRepository } from '@/modules/profiles/infrastructure';

export const deleteAccountAction = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const deleteAccountUseCase = createDeleteAccountUseCase({
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

  return deleteAccountUseCase({
    lastSignInAt: user?.last_sign_in_at ?? null,
  });
};
