'use client';

import { Database } from '@/types/supabase';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const createClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
};

// Cliente global para uso en componentes del cliente
export const supabaseClient = createClient();
