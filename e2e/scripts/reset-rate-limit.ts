import { loadEnvFiles } from '../helpers/env.helper';
loadEnvFiles();
import { E2E_TEST_EMAIL, getSupabaseAdmin } from '../helpers/auth.helper';
import { clearTestUserRateLimits } from '../helpers/cleanup.helper';

/**
 * Resetea manualmente los rate limits del test user (todas las ventanas).
 * La suite ya lo hace en global-setup/teardown; esto sirve para destrabar una
 * corrida local sin relaunch completo.
 */
async function main() {
  const admin = getSupabaseAdmin();
  if (!admin) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    return;
  }

  const {
    data: { users },
    error,
  } = await admin.auth.admin.listUsers();
  if (error) {
    console.error('Error listing users:', error.message);
    return;
  }

  const user = users.find((u) => u.email === E2E_TEST_EMAIL);
  if (!user) {
    console.log('Test user not found');
    return;
  }

  console.log('Test user ID:', user.id);
  await clearTestUserRateLimits(user.id);
}

main().catch(console.error);
