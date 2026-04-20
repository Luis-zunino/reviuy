import { RateLimitType, withRateLimit } from '@/lib';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const createServerActionDeps = async () => {
  const supabase = await createSupabaseServerClient();

  const getCurrentUserId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user?.id ?? null;
  };

  const rateLimit = async (key: string, scope: RateLimitType) => {
    await withRateLimit(key, scope);
  };

  return {
    supabase,
    getCurrentUserId,
    rateLimit,
  };
};
