import { AuthError } from '@supabase/supabase-js';

export interface AppSession {
  userId?: string;
  expiresAt?: number;
}

export interface UseGetSession {
  session: AppSession | null;
  error: null | AuthError;
}
