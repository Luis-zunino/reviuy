import { test, expect } from '../fixtures/auth.fixture';

test.describe('Account — sesión y perfil', () => {
  test('la sección de eliminar cuenta está presente en el perfil', async ({ authPage }) => {
    await authPage.goto('/profile');

    // Navegar al tab de Configuración (Zona de Peligro está ahí)
    await authPage.getByRole('tab', { name: 'Configuración' }).click();

    // Scroll hasta la zona de peligro (puede estar al final de la página)
    const dangerSection = authPage.getByText('Zona de Peligro');
    await expect(dangerSection).toBeVisible({ timeout: 10000 });
    await dangerSection.scrollIntoViewIfNeeded();

    // Botón de eliminar cuenta
    const deleteButton = authPage.getByRole('button', { name: 'Eliminar mi cuenta' });
    await expect(deleteButton).toBeVisible();

    // Abrir diálogo de confirmación
    await deleteButton.click();

    // Verificar el contenido del diálogo
    await expect(authPage.getByText('¿Estás absolutamente seguro?')).toBeVisible();
    await expect(authPage.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(authPage.getByRole('button', { name: 'Sí, eliminar cuenta' })).toBeVisible();

    // Cerrar el diálogo sin eliminar
    await authPage.getByRole('button', { name: 'Cancelar' }).click();

    // Verificar que el diálogo se cerró
    await expect(authPage.getByText('¿Estás absolutamente seguro?')).not.toBeVisible();
  });

  test('cierra sesión desde el menú de navegación', async ({ authPage }) => {
    // Usamos authPage autenticado para no invalidar el storageState compartido
    await authPage.goto('/profile');
    await expect(authPage.getByRole('heading', { name: 'Perfil' })).toBeVisible();

    // Abrir menú de navegación
    await authPage.getByRole('button', { name: 'Abrir menú principal' }).click();

    // Hacer clic en Cerrar sesión (es un <a> dentro de DropdownMenuItem)
    await authPage.getByText('Cerrar sesión').click();

    // Esperar redirección a home
    await authPage.waitForURL('/', { timeout: 10000 });

    // Verificar que las rutas protegidas ya no son accesibles
    await authPage.goto('/profile');
    await authPage.waitForURL(/\/login/);
    await expect(authPage.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
  });
});
