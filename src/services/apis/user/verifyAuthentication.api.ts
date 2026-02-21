'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { AuthError } from '@supabase/supabase-js';

export interface VerifyAuthenticationResponse {
  userId: string | null;
  error: AuthError | null;
}
export const verifyAuthentication = async (): Promise<VerifyAuthenticationResponse> => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getUser();

  return { userId: data.user?.id ?? null, error };
};
