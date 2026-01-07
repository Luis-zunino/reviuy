import { AppSession } from '@/services/apis/user/types';
import { Session } from '@supabase/supabase-js';

export const sessionMapped = (session: Session | null) => {
  const sessionMapped: AppSession = {
    providerToken: session?.provider_token,
    providerRefreshToken: session?.provider_refresh_token,
    accessToken: session?.access_token,
    refreshToken: session?.refresh_token,
    expiresIn: session?.expires_in,
    expiresAt: session?.expires_at,
    tokenType: session?.token_type,
    userId: session?.user?.id,
  };

  return sessionMapped;
};
