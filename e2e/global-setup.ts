import { chromium } from '@playwright/test';
import { loadEnvFiles } from './helpers/env.helper';
import {
  ensureTestUser,
  getTestSession,
  buildAuthCookies,
  AUTH_STORAGE_PATH,
} from './helpers/auth.helper';

loadEnvFiles();

export default async function globalSetup() {
  console.log('[e2e] Global setup: creating test user…');

  const user = await ensureTestUser();
  if (!user) {
    console.log('[e2e] ⚠️ Supabase env vars no disponibles — saltando setup de auth');
    return;
  }
  console.log('[e2e] Test user ready');

  const session = await getTestSession();
  if (!session) {
    console.log('[e2e] ⚠️ No se pudo obtener sesión — tests con auth se skipearán');
    return;
  }
  console.log('[e2e] Test session obtained');

  const cookies = buildAuthCookies(session);

  const browser = await chromium.launch();
  const context = await browser.newContext();

  await context.addCookies(cookies);

  await context.storageState({ path: AUTH_STORAGE_PATH });
  console.log(`[e2e] Auth storageState guardado en ${AUTH_STORAGE_PATH}`);

  await browser.close();
}
