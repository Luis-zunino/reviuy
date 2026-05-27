import { chromium } from '@playwright/test';
import { loadEnvFiles } from './helpers/env.helper';
import { ensureTestUser, getTestSession, buildAuthCookies, AUTH_STORAGE_PATH } from './helpers/auth.helper';

loadEnvFiles();

export default async function globalSetup() {
  console.log('[e2e] Global setup: creating test user…');

  await ensureTestUser();
  console.log('[e2e] Test user ready');

  const session = await getTestSession();
  console.log('[e2e] Test session obtained');

  const cookies = buildAuthCookies(session);

  const browser = await chromium.launch();
  const context = await browser.newContext();

  await context.addCookies(cookies);

  await context.storageState({ path: AUTH_STORAGE_PATH });
  console.log(`[e2e] Auth storageState guardado en ${AUTH_STORAGE_PATH}`);

  await browser.close();
}
