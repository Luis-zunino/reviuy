import { test, expect } from '../fixtures/auth.fixture';
import { deleteReview } from '../helpers/cleanup.helper';

const ORIGINAL_TITLE = 'Excelente ubicación, departamento luminoso — edit test';
const NEW_TITLE = 'Título actualizado después de editar la reseña';

test.describe.serial('Review — editar reseña', () => {
  let reviewId: string | null = null;

  test.afterAll(async () => {
    if (reviewId) {
      await deleteReview(reviewId);
    }
  });

  test('crea reseña via UI, abre el editor y verifica datos precargados', async ({ authPage }) => {
    // ── Crear reseña via UI ──
    await authPage.goto('/review/create');

    // Address search
    const searchInput = authPage.getByPlaceholder('Busca una direccion...');
    await searchInput.click();
    await searchInput.type('Montevideo, Uruguay', { delay: 100 });
    const option = authPage.getByRole('option').first();
    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click();

    // Title
    await authPage.getByPlaceholder('Ej: Excelente ubicación').fill(ORIGINAL_TITLE);

    // Property type
    await authPage.getByRole('combobox').click();
    await authPage.getByRole('option', { name: 'Apartamento' }).click();

    // Rating: 4 estrellas
    await authPage.locator('[role="radiogroup"]').first()
      .getByRole('radio', { name: '4 estrellas' }).click();

    // Zone rating: 3 estrellas
    await authPage.locator('[role="radiogroup"]').nth(1)
      .getByRole('radio', { name: '3 estrellas' }).click();

    // Description
    await authPage.getByPlaceholder('Comparte los detalles')
      .fill('Reseña de prueba para el test de edición.');

    // Step 1 → Step 2
    await authPage.getByRole('button', { name: 'Ir al siguiente paso' }).click();
    await expect(authPage.getByText('Características')).toBeVisible();

    // Step 2 → Step 3
    await authPage.getByRole('button', { name: 'Ir al siguiente paso' }).click();

    // Submit
    await authPage.getByRole('button', { name: 'Guardar formulario' }).click();

    // Esperar redirección a details
    await authPage.waitForURL(/\/review\/(.+)\/details/);
    const match = authPage.url().match(/\/review\/(.+)\/details/);
    reviewId = match?.[1] ?? null;
    expect(reviewId).toBeTruthy();

    await expect(authPage.getByText('¡Reseña publicada!')).toBeVisible();

    // ── Navegar a la página de edición ──
    await authPage.goto(`/review/${reviewId}/edit`);

    // Esperar que cargue el formulario con datos
    await expect(authPage.getByRole('heading', { name: 'Comparte tu experiencia' })).toBeVisible();

    // Verificar que el título está precargado
    const titleInput = authPage.getByPlaceholder('Ej: Excelente ubicación');
    await expect(titleInput).toHaveValue(ORIGINAL_TITLE);

    // Verificar que la descripción está precargada
    await expect(authPage.getByPlaceholder('Comparte los detalles'))
      .toHaveValue('Reseña de prueba para el test de edición.');

    // Verificar que el botón de guardar existe en step 3
    // (el formulario multi-paso arranca en step 1)
    await expect(authPage.getByRole('button', { name: 'Ir al siguiente paso' })).toBeVisible();
  });

  test('edita el título, envía y verifica cambios en detalle', async ({ authPage }) => {
    expect(reviewId).toBeTruthy();

    await authPage.goto(`/review/${reviewId}/edit`);

    // Esperar que cargue el formulario
    await expect(authPage.getByPlaceholder('Ej: Excelente ubicación')).toHaveValue(ORIGINAL_TITLE, { timeout: 10000 });

    // Cambiar el título
    const titleInput = authPage.getByPlaceholder('Ej: Excelente ubicación');
    await titleInput.clear();
    await titleInput.fill(NEW_TITLE);

    // Avanzar Step 1 → Step 2
    await authPage.getByRole('button', { name: 'Ir al siguiente paso' }).click();
    await expect(authPage.getByText('Características')).toBeVisible();

    // Step 2 → Step 3
    await authPage.getByRole('button', { name: 'Ir al siguiente paso' }).click();

    // Submit
    await authPage.getByRole('button', { name: 'Guardar formulario' }).click();

    // Esperar redirección a details
    await authPage.waitForURL(/\/review\/(.+)\/details/);
    expect(authPage.url()).toMatch(/\/review\/(.+)\/details/);

    // Verificar toast de éxito
    await expect(authPage.getByText('Reseña actualizada')).toBeVisible();

    // Verificar que el nuevo título se muestra en la página de detalle
    await expect(authPage.getByText(NEW_TITLE)).toBeVisible();
  });
});
