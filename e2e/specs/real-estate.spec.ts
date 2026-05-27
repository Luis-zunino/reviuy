import { test, expect } from '../fixtures/auth.fixture';
import {
  E2E_TEST_EMAIL,
  E2E_TEST_PASSWORD,
  getSupabaseClient as getAuthClient,
} from '../helpers/auth.helper';

const TEST_REAL_ESTATE_NAME = `E2E Test Inmobiliaria ${Date.now()}`;

test.describe.serial('Real Estate — listado y detalle', () => {
  let realEstateId: string | null = null;

  test.beforeAll(async () => {
    const authClient = getAuthClient();
    if (!authClient) return; // CI sin credenciales reales

    // Crear una inmobiliaria via RPC para tener datos que ver
    const { error: signInError } = await authClient.auth.signInWithPassword({
      email: E2E_TEST_EMAIL,
      password: E2E_TEST_PASSWORD,
    });
    if (signInError) throw new Error(`[real-estate] Error signing in: ${signInError.message}`);

    const { data, error } = await authClient.rpc('create_real_estate', {
      p_name: TEST_REAL_ESTATE_NAME,
      p_description: 'Inmobiliaria creada para tests e2e',
    });

    if (error) throw new Error(`[real-estate] Error creating real estate: ${error.message}`);
    if (!data?.success) throw new Error(`[real-estate] create_real_estate failed: ${data?.error}`);

    realEstateId = data.id as string;
  });

  test.afterAll(async () => {
    if (!realEstateId) return;
    console.log(`[real-estate] Test real estate ID: ${realEstateId}`);
  });

  test('página de listado carga con elementos principales', async ({ page }) => {
    test.skip(!getAuthClient(), 'Supabase no configurado en este entorno');
    await page.goto('/real-estate');

    await expect(page.getByRole('heading', { name: 'Inmobiliarias' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Filtros' })).toBeVisible();
    await expect(page.getByPlaceholder('Ej: Inmobiliaria ABC')).toBeVisible();

    await expect(page.getByText(/Mostrando \d+ inmobiliaria(s)?/)).toBeVisible();
  });

  test('filtra inmobiliarias por nombre', async ({ page }) => {
    test.skip(!realEstateId, 'No se pudo crear inmobiliaria de prueba');
    await page.goto('/real-estate');

    const searchInput = page.getByPlaceholder('Ej: Inmobiliaria ABC');
    await searchInput.fill(TEST_REAL_ESTATE_NAME);

    await page.waitForTimeout(1000);

    await expect(page.getByText(TEST_REAL_ESTATE_NAME)).toBeVisible();
  });

  test('página de detalle de inmobiliaria carga correctamente', async ({ page }) => {
    test.skip(!realEstateId, 'No se pudo crear inmobiliaria de prueba');

    await page.goto(`/real-estate/${realEstateId}`);

    await expect(page.getByRole('heading', { name: 'Reseñas y calificaciones' })).toBeVisible();

    await expect(page.getByText(TEST_REAL_ESTATE_NAME)).toBeVisible();

    await expect(page.getByRole('tab', { name: 'Reseñas' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Experiencia' })).toBeVisible();
  });
});
