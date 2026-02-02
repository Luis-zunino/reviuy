import { supabaseClient } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';

export interface VerifyAuthenticationResponse {
  userId: string | null;
  error: AuthError | null;
}
export const verifyAuthentication = async (): Promise<VerifyAuthenticationResponse> => {
  const { data, error } = await supabaseClient.auth.getUser();

  return { userId: data.user?.id ?? null, error };
};
