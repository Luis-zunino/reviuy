import { supabaseClient } from '@/lib/supabase-client';
import { UseGetSession } from './types';

export const getSession = async (): Promise<UseGetSession> => {
  const { data, error } = await supabaseClient.auth.getSession();
  return { session: data.session, error };
};
