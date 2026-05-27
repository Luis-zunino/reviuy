import { loadEnvFiles } from '../helpers/env.helper';
loadEnvFiles();
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function main() {
  const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const email = 'e2e-test@reviuy.qa';

  const { data: { users }, error: usersError } = await admin.auth.admin.listUsers();
  if (usersError) { console.error('Error listing users:', usersError.message); return; }
  const user = users?.find(u => u.email === email);
  if (!user) { console.log('Test user not found'); return; }

  console.log('Test user ID:', user.id);

  // Try direct delete via REST API (service_role bypasses RLS)
  const { error } = await admin
    .from('rate_limits')
    .delete()
    .eq('user_id', user.id)
    .eq('endpoint', 'create_review');

  if (error) {
    console.error('Error deleting rate limits:', error.message);
    return;
  }
  console.log('Rate limit entries deleted');
}

main().catch(console.error);
