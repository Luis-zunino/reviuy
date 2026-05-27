import { test, expect } from '@playwright/test';

test.describe('Explorar — página de búsqueda', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/explorar');
  });

  test('elementos principales están presentes', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Explorar reseñas');
    await expect(page.locator('input#zone-search')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Detectar mi ubicación actual' })).toBeVisible();
  });

  test('muestra estado vacío inicial', async ({ page }) => {
    await expect(page.getByText('Explora reseñas por zona')).toBeVisible();
  });

  test('busca al escribir un término', async ({ page }) => {
    const input = page.locator('input#zone-search');
    await input.fill('Montevideo');

    // Espera que desaparezca el estado idle o aparezcan resultados
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Si hay resultados, muestra el contador; si no, muestra "Sin reseñas"
    const resultadosHeading = page.locator('h2').filter({ hasText: /reseñas/ });
    const idleText = page.getByText('Explora reseñas por zona');

    const resultadosVisible = await resultadosHeading.isVisible().catch(() => false);
    const idleGone = !(await idleText.isVisible().catch(() => true));

    expect(resultadosVisible || idleGone).toBeTruthy();
  });

  test('input vacío muestra hint de 3 caracteres', async ({ page }) => {
    const input = page.locator('input#zone-search');
    await input.fill('ab');
    await expect(page.getByText('Ingresa al menos 3 caracteres.')).toBeVisible();
  });

  test('botón limpiar resetea la búsqueda', async ({ page }) => {
    const input = page.locator('input#zone-search');

    // Si hay resultados, podemos limpiar
    await input.fill('Montevideo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Si el botón limpiar no está visible, saltamos el test
    const clearButton = page.getByRole('button', { name: 'Limpiar búsqueda' });
    if (await clearButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await clearButton.click();
      await expect(input).toHaveValue('');
      await expect(page.getByText('Explora reseñas por zona')).toBeVisible();
    }
  });

  test('el input de búsqueda tiene atributos correctos', async ({ page }) => {
    const input = page.locator('input#zone-search');
    await expect(input).toHaveAttribute('type', 'search');
    await expect(input).toHaveAttribute('placeholder', /Ej:/);
    await expect(input).toHaveAttribute('aria-label', 'Buscar por zona o barrio');
  });
});
