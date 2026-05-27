import { test, expect } from '../fixtures/auth.fixture';

test.describe('Perfil — página de perfil con sesión', () => {
  test('elementos principales del perfil cargan', async ({ authPage }) => {
    await authPage.goto('/profile');
    await expect(authPage.locator('h1')).toContainText('Mi perfil');
    await expect(authPage.getByRole('tab', { name: 'Mis reseñas' })).toBeVisible();
    await expect(authPage.getByRole('tab', { name: 'Favoritas' })).toBeVisible();
    await expect(authPage.getByRole('tab', { name: 'Inmobiliarias' })).toBeVisible();
    await expect(authPage.getByRole('tab', { name: 'Configuración' })).toBeVisible();
  });

  test('pestaña Mis reseñas se selecciona por defecto', async ({ authPage }) => {
    await authPage.goto('/profile');
    const reviewsTab = authPage.getByRole('tab', { name: 'Mis reseñas' });
    await expect(reviewsTab).toHaveAttribute('data-state', 'active');
  });

  test('navega entre pestañas', async ({ authPage }) => {
    await authPage.goto('/profile');

    await authPage.getByRole('tab', { name: 'Configuración' }).click();
    await expect(authPage.getByRole('tab', { name: 'Configuración' })).toHaveAttribute('data-state', 'active');

    await authPage.getByRole('tab', { name: 'Mis reseñas' }).click();
    await expect(authPage.getByRole('tab', { name: 'Mis reseñas' })).toHaveAttribute('data-state', 'active');
  });
});
