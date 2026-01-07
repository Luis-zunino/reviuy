import { supabaseClient } from '@/lib/supabase-client';

export interface VerifyAuthenticationResponse {
  userId: string | null;
  error: Error | null;
}
export const verifyAuthentication = async (): Promise<VerifyAuthenticationResponse> => {
  const { data, error } = await supabaseClient.auth.getUser();

  return { userId: data.user?.id ?? null, error };
};
