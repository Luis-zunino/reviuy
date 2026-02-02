import { supabaseClient } from '@/lib/supabase';
import { UseGetSession } from './types';
import { sessionMapped } from '@/utils';

export const getSession = async (): Promise<UseGetSession> => {
  const { data, error } = await supabaseClient.auth.getSession();
  const session = sessionMapped(data.session);

  return { session, error };
};
