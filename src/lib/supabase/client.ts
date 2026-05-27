'use client';

import { Database } from '@/types/supabase';
import { createBrowserClient } from '@supabase/ssr';

type SupabaseBrowserClient = ReturnType<typeof createBrowserClient<Database>>;

let clientInstance: SupabaseBrowserClient | null = null;

function getClient(): SupabaseBrowserClient {
  if (!clientInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    clientInstance = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  }
  return clientInstance;
}

export const createClient = (): SupabaseBrowserClient => {
  return getClient();
};

// Lazy singleton proxy — defers client creation until first property access
export const supabaseClient: SupabaseBrowserClient = new Proxy({} as SupabaseBrowserClient, {
  get(_, prop) {
    return getClient()[prop as keyof SupabaseBrowserClient];
  },
});
