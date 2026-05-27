import { test, expect } from '@playwright/test';

test.describe('Smoke tests — páginas públicas', () => {
  test('Home carga y muestra el título principal', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveTitle(/ReviUy/);
  });

  test('Explorar carga sin errores', async ({ page }) => {
    await page.goto('/explorar');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Login carga con formulario', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('FAQ carga', async ({ page }) => {
    await page.goto('/faq');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Términos y condiciones cargan', async ({ page }) => {
    await page.goto('/terminos');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Privacidad carga', async ({ page }) => {
    await page.goto('/privacidad');
    await expect(page.getByRole('heading', { name: 'Política de privacidad', exact: true })).toBeVisible();
  });

  test('Tips carga con lista', async ({ page }) => {
    await page.goto('/tips');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('About carga', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Contacto carga con formulario', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('button[type="submit"]')).toBeAttached();
  });

  test('Good practices carga', async ({ page }) => {
    await page.goto('/good-practices');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Página de review/create redirige a login si no autenticado', async ({ page }) => {
    await page.goto('/review/create');
    // Al no estar autenticado, el middleware redirige a /login
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain('/login');
  });

  test('404 page se muestra para rutas inexistentes', async ({ page }) => {
    const response = await page.goto('/ruta-que-no-existe-12345');
    expect(response?.status()).toBe(404);
  });
});
