import { supabaseClient } from '@/lib/supabase-client';
import { UserResponse } from '@supabase/supabase-js';

export const verifyAuthentication = async (): Promise<UserResponse> => {
  return await supabaseClient.auth.getUser();
};
