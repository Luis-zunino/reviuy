import { test as base } from '@playwright/test';
import { injectAuthCookies } from '../helpers/auth.helper';

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
export const test = base.extend<{ authPage: import('@playwright/test').Page }>({
  authPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    await injectAuthCookies(context);
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
