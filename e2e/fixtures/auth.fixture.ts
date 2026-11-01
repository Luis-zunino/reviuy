import { test as base } from '@playwright/test';
import {
  E2E_SECONDARY_TEST_EMAIL,
  E2E_SECONDARY_TEST_PASSWORD,
  ensureTestUser,
  injectAuthCookies,
} from '../helpers/auth.helper';

/**
 * Fixture de test que extiende Playwright con un page autenticado.
 *
 * Inyecta cookies de sesión FRESCAS en cada uso (no depende del storageState,
 * que puede quedar stale si otro test hizo signOut).
 *
 * Uso:
 *   import { test } from '@/e2e/fixtures/auth.fixture';
 *   import { expect } from '@playwright/test';
 *
 *   test('protegida carga', async ({ authPage }) => {
 *     await authPage.goto('/profile');
 *     await expect(authPage.locator('h1')).toBeVisible();
 *   });
 */
export const test = base.extend<{
  authPage: import('@playwright/test').Page;
  otherAuthPage: import('@playwright/test').Page;
}>({
  authPage: async ({ browser }, use, testInfo) => {
    const context = await browser.newContext();
    const ok = await injectAuthCookies(context);
    if (!ok) {
      testInfo.skip();
      await context.close();
      return;
    }
    const page = await context.newPage();
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture release fn, not React hook
    await use(page);
    await context.close();
  },
  otherAuthPage: async ({ browser }, use, testInfo) => {
    const context = await browser.newContext();
    const credentials = {
      email: E2E_SECONDARY_TEST_EMAIL,
      password: E2E_SECONDARY_TEST_PASSWORD,
    };
    const user = await ensureTestUser(credentials);
    if (!user) {
      testInfo.skip();
      await context.close();
      return;
    }

    const ok = await injectAuthCookies(context, credentials);
    if (!ok) {
      testInfo.skip();
      await context.close();
      return;
    }

    const page = await context.newPage();
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture release fn, not React hook
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
