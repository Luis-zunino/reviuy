import { loadEnvFiles } from '../helpers/env.helper';
loadEnvFiles();
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const email = 'e2e-test@reviuy.qa';
const password = 'TestPassword123!';

async function main() {
  const supabase = createClient(url, key);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) { console.error('Sign in:', error.message); return; }

  const { data, error: e } = await supabase.from('reviews_public').select('id, title, is_mine').limit(5);
  if (e) { console.error('Query:', e.message); return; }
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
