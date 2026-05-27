import { test, expect } from '../fixtures/auth.fixture';
import { deleteReview } from '../helpers/cleanup.helper';

test.describe.serial('Review — página de detalle', () => {
  let reviewId: string | null = null;

  test.afterAll(async () => {
    if (reviewId) {
      await deleteReview(reviewId);
    }
  });

  test('crea reseña via UI y carga la página de detalle', async ({ authPage }) => {
    // ── Crear reseña via UI (como review-create-full) ──
    await authPage.goto('/review/create');

    // Address search
    const searchInput = authPage.getByPlaceholder('Busca una direccion...');
    await searchInput.click();
    await searchInput.type('Montevideo, Uruguay', { delay: 100 });
    const option = authPage.getByRole('option').first();
    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click();

    // Title
    await authPage.getByPlaceholder('Ej: Excelente ubicación').fill('Excelente ubicación, departamento luminoso');

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
    await authPage.getByPlaceholder('Comparte los detalles').fill('Viví aquí por dos años y la experiencia fue increíble. El barrio tiene todos los servicios cerca.');

    // Step 1 → Step 2
    await authPage.getByRole('button', { name: 'Ir al siguiente paso' }).click();
    await expect(authPage.getByText('Características')).toBeVisible();

    // Step 2 → Step 3
    await authPage.getByRole('button', { name: 'Ir al siguiente paso' }).click();

    // Submit
    await authPage.getByRole('button', { name: 'Guardar formulario' }).click();

    // Esperar redirección
    await authPage.waitForURL(/\/review\/(.+)\/details/);
    const match = authPage.url().match(/\/review\/(.+)\/details/);
    reviewId = match?.[1] ?? null;
    expect(reviewId).toBeTruthy();

    // Toast de éxito
    await expect(authPage.getByText('¡Reseña publicada!')).toBeVisible();

    // ── Verificar elementos del detalle ──
    // Heading
    await expect(authPage.getByRole('heading', { name: 'Detalles de la reseña' })).toBeVisible();

    // Breadcrumb
    await expect(authPage.getByRole('link', { name: 'Reseñas' })).toBeVisible();

    // Card "Opinión"
    await expect(authPage.getByText('Opinión')).toBeVisible();
    await expect(authPage.getByText('Excelente ubicación, departamento luminoso')).toBeVisible();

    // Card "Valoración"
    await expect(authPage.getByText('Valoración')).toBeVisible();

    // Tipo de propiedad (en sidebar)
    await expect(authPage.getByRole('complementary').getByText('Apartamento', { exact: true })).toBeVisible();

    // Badge "Recomiendo" (rating 4 >= 3.5)
    await expect(authPage.getByText('Recomiendo')).toBeVisible();

    // Botón de favorito
    await expect(authPage.getByTitle(/favoritos/i)).toBeVisible();

    // Botón de editar (is_mine = true)
    const editButton = authPage.getByRole('button', { name: /editar/i });
    await expect(editButton).toBeVisible();

    // Botón de eliminar
    await expect(authPage.getByRole('button', { name: 'Eliminar' })).toBeVisible();

    // Botones de voto
    await expect(authPage.getByRole('button', { name: 'Marcar como útil' })).toBeVisible();
    await expect(authPage.getByRole('button', { name: 'Marcar como no útil' })).toBeVisible();

    // Mapa
    await expect(authPage.locator('.leaflet-container').first()).toBeVisible({ timeout: 10000 });
  });

  test('vota like y dislike en la reseña', async ({ authPage }) => {
    await authPage.goto(`/review/${reviewId}/details`);

    // Votar like
    const likeButton = authPage.getByRole('button', { name: 'Marcar como útil' });
    await likeButton.click();
    await expect(authPage.getByRole('button', { name: 'Ya votaste útil' })).toBeVisible({ timeout: 10000 });

    // Quitar voto (toggle)
    await authPage.getByRole('button', { name: 'Ya votaste útil' }).click();
    await expect(authPage.getByRole('button', { name: 'Marcar como útil' })).toBeVisible({ timeout: 10000 });

    // Votar dislike
    const dislikeButton = authPage.getByRole('button', { name: 'Marcar como no útil' });
    await dislikeButton.click();
    await expect(authPage.getByRole('button', { name: 'Ya votaste no útil' })).toBeVisible({ timeout: 10000 });

    // Quitar dislike
    await authPage.getByRole('button', { name: 'Ya votaste no útil' }).click();
    await expect(authPage.getByRole('button', { name: 'Marcar como no útil' })).toBeVisible({ timeout: 10000 });
  });

  test('marca y desmarca favorito', async ({ authPage }) => {
    await authPage.goto(`/review/${reviewId}/details`);

    const favButton = authPage.getByTitle(/favoritos/i);

    // Marcar favorito — esperar que termine la mutación
    await favButton.click();
    await expect(favButton).toHaveAttribute('data-active', 'true', { timeout: 10000 });
    // Verificar que cambió el tooltip
    await expect(favButton).toHaveAttribute('title', 'Quitar de favoritos');

    // Desmarcar
    await favButton.click();
    await expect(favButton).toHaveAttribute('data-active', 'false', { timeout: 10000 });
    await expect(favButton).toHaveAttribute('title', 'Agregar a favoritos');
  });
});
