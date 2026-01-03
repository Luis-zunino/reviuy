import { supabaseClient } from '@/lib/supabase-client';

export const getSession = async () => {
  return await supabaseClient.auth.getSession();
};
