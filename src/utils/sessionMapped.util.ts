import type { AppSession } from '@/modules/profiles/domain';
import { Session } from '@supabase/supabase-js';

export const sessionMapped = (session: Session | null): AppSession | null => {
  if (!session) {
    return null;
  }

  const sessionMapped: AppSession = {
    userId: session?.user?.id,
    expiresAt: session?.expires_at,
  };

  return sessionMapped;
};
