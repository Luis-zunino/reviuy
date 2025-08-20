import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be defined in .env.local');
}

// export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
export const supabase = {}
