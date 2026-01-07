import { AuthError } from '@supabase/supabase-js';

export interface AppSession {
  userId?: string;
  providerToken?: string | null;
  providerRefreshToken?: string | null;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  expiresAt?: number;
}

export interface UseGetSession {
  session: AppSession | null;
  error: null | AuthError;
}
