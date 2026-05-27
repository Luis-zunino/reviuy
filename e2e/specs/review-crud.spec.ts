import { test, expect } from '../fixtures/auth.fixture';

test.describe('Review — creación', () => {
  test('página de crear reseña carga correctamente', async ({ authPage }) => {
    await authPage.goto('/review/create');
    await expect(authPage.locator('h1')).toBeVisible();
    await expect(authPage.getByRole('button', { name: 'Ir al siguiente paso' })).toBeVisible();
  });

  test('paso 1 valida campos requeridos al hacer clic en Siguiente', async ({ authPage }) => {
    await authPage.goto('/review/create');
    await authPage.getByRole('button', { name: 'Ir al siguiente paso' }).click();
    await expect(authPage.getByText('Este campo es necesario').first()).toBeVisible();
  });

  test('busca dirección vía Nominatim y muestra resultados', async ({ authPage }) => {
    await authPage.goto('/review/create');
    const searchInput = authPage.getByPlaceholder('Busca una direccion...');

    // type() lento para activar bien los eventos de react-hook-form
    await searchInput.click();
    await searchInput.type('Montevideo, Uruguay', { delay: 100 });
    await authPage.waitForTimeout(3000);

    // Esperar resultados del dropdown (Nominatim: 1s debounce + API call)
    const option = authPage.getByRole('option').first();
    await expect(option).toBeVisible({ timeout: 15000 });
    expect(await option.textContent()).toContain('Montevideo');
  });
});
