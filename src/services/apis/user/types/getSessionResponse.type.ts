import { AuthError, Session } from '@supabase/supabase-js';

export interface UseGetSession {
  session: Session | null;
  error: null | AuthError;
}
