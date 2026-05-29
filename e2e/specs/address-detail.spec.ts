import { test, expect } from '../fixtures/auth.fixture';

test.describe('Address — página de detalle por dirección', () => {
  test('carga con los elementos principales para Montevideo', async ({ page }) => {
    // R2929054 = Montevideo, Uruguay (relation osm_id=2929054)
    await page.goto('/address/R2929054');

    // Debe mostrar el título de la página (dentro de PageWithSidebar)
    await expect(page.getByRole('heading', { name: 'Reseñas', exact: true })).toBeVisible({
      timeout: 15000,
    });

    // Debe mostrar el nombre de la dirección (Montevideo) en el sidebar
    await expect(page.getByText(/Montevideo/i).first()).toBeVisible({
      timeout: 15000,
    });

    // Debe mostrar el mapa en la sidebar
    await expect(page.locator('.leaflet-container').first()).toBeVisible({ timeout: 10000 });

    // Debe mostrar el botón "Compartí tu experiencia"
    await expect(page.getByRole('button', { name: /compartí/i }).first()).toBeVisible();
  });

  test('muestra mensaje de estado vacío cuando no hay reseñas', async ({ authPage }) => {
    await authPage.goto('/address/R2929054');

    // Esperar que cargue la dirección (Montevideo ahora en <p> del sidebar)
    await expect(authPage.getByText(/Montevideo/i).first()).toBeVisible({
      timeout: 15000,
    });

    // Debe mostrar el mensaje de estado vacío
    await expect(authPage.getByText('Aún no hay reseñas para esta dirección')).toBeVisible();
  });
});
