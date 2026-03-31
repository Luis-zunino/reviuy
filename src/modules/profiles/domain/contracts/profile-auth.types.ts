import type { AuthError } from '@supabase/supabase-js';

export interface AppSession {
  userId?: string;
  expiresAt?: number;
}

export interface VerifyAuthenticationOutput {
  userId: string | null;
  error: AuthError | null;
}

export interface GetSessionOutput {
  session: AppSession | null;
  error: AuthError | null;
}
