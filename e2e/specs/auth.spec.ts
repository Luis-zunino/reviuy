import { test as authTest, expect } from '../fixtures/auth.fixture';
import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Auth — página de login', () => {
  test('todos los elementos del formulario están presentes', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await expect(login.heading).toBeVisible();
    await expect(login.emailInput).toBeVisible();
    await expect(login.submitButton).toBeVisible();
    await expect(login.googleButton).toBeVisible();
  });
});

test.describe('Auth — rutas protegidas redirigen', () => {
  const PROTECTED_ROUTES = ['/profile', '/review/create'];

  for (const route of PROTECTED_ROUTES) {
    test(`"${route}" redirige a /login sin autenticación`, async ({ page }) => {
      await page.goto(route);

      await page.waitForURL(/\/login/);
      expect(page.url()).toContain('/login');
    });
  }
});

authTest.describe('Auth — sesión activa', () => {
  authTest('perfil carga correctamente con sesión', async ({ authPage }) => {
    await authPage.goto('/profile');
    await expect(authPage.locator('h1')).toBeVisible();
    expect(authPage.url()).not.toContain('/login');
  });

  authTest('/login redirige a / si ya hay sesión', async ({ authPage }) => {
    await authPage.goto('/login');
    await authPage.waitForURL('**/');
  });

  authTest('review/create carga sin redirección con sesión', async ({ authPage }) => {
    await authPage.goto('/review/create');
    await authPage.waitForLoadState('networkidle');
    expect(authPage.url()).not.toContain('/login');
    await expect(authPage.locator('body')).toBeVisible();
  });
});
