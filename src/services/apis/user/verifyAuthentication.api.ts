import { supabaseClient } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';

export interface VerifyAuthenticationResponse {
  user: User | null;
  error: Error | null;
}
export const verifyAuthentication = async (): Promise<VerifyAuthenticationResponse> => {
  const { data, error } = await supabaseClient.auth.getUser();

  return { user: data.user, error };
};
