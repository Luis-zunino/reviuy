import { test, expect } from '../fixtures/auth.fixture';
import { deleteReview } from '../helpers/cleanup.helper';

const TITLE = 'Excelente ubicación, departamento muy luminoso y amplio';
const DESCRIPTION = 'Viví aquí por dos años y la experiencia fue increíble. El barrio tiene todos los servicios cerca, el transporte público funciona muy bien y los vecinos son amables.';

test.describe('Review — flujo completo de creación', () => {
  let createdReviewId: string | null = null;

  test.afterEach(async () => {
    if (createdReviewId) {
      await deleteReview(createdReviewId);
    }
  });

  test('crea una reseña y redirige a detalles', async ({ authPage }) => {
    await authPage.goto('/review/create');

    // ── Step 1: General ──
    // Address search via Nominatim
    const searchInput = authPage.getByPlaceholder('Busca una direccion...');
    await searchInput.click();
    await searchInput.type('Montevideo, Uruguay', { delay: 100 });
    const option = authPage.getByRole('option').first();
    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click();

    // Title
    await authPage.getByPlaceholder('Ej: Excelente ubicación').fill(TITLE);

    // Property type
    await authPage.getByRole('combobox').click();
    await authPage.getByRole('option', { name: 'Apartamento' }).click();

    // Apartment number
    await authPage.getByPlaceholder('Ej: 3A, Piso 2, Apt 12').fill('3A');

    // Rating: 4 estrellas
    await authPage.locator('[role="radiogroup"]').first()
      .getByRole('radio', { name: '4 estrellas' }).click();

    // Zone rating: 4 estrellas
    await authPage.locator('[role="radiogroup"]').nth(1)
      .getByRole('radio', { name: '4 estrellas' }).click();

    // Description
    await authPage.getByPlaceholder('Comparte los detalles').fill(DESCRIPTION);

    // Avanzar a Step 2
    await authPage.getByRole('button', { name: 'Ir al siguiente paso' }).click();
    await expect(authPage.getByText('Características')).toBeVisible();
    await expect(authPage.getByText('¿Qué tan agradable es la propiedad en invierno?')).toBeVisible();

    // ── Step 2: Características (avanzar sin rellenar) ──
    await authPage.getByRole('button', { name: 'Ir al siguiente paso' }).click();

    // ── Step 3: Inmobiliaria ──
    await expect(authPage.getByRole('button', { name: 'Guardar formulario' })).toBeVisible();

    // Submit
    await authPage.getByRole('button', { name: 'Guardar formulario' }).click();

    // Esperar redirección a /review/{id}/details
    await authPage.waitForURL(/\/review\/(.+)\/details/);
    expect(authPage.url()).toMatch(/\/review\/(.+)\/details/);

    // Extraer ID para cleanup
    const match = authPage.url().match(/\/review\/(.+)\/details/);
    createdReviewId = match?.[1] ?? null;

    // Verificar toast de éxito
    await expect(authPage.getByText('¡Reseña publicada!')).toBeVisible();

    // Verificar que la página de detalles carga
    await expect(authPage.locator('h1')).toBeVisible();
  });
});
