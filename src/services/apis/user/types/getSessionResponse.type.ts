import { AuthError } from '@supabase/supabase-js';
import type { AppSession } from '@/modules/profiles/domain';

export interface UseGetSession {
  session: AppSession | null;
  error: null | AuthError;
}
