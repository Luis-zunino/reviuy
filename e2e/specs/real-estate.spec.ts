import { test, expect } from '../fixtures/auth.fixture';
import { createClient } from '@supabase/supabase-js';
import { E2E_TEST_EMAIL, E2E_TEST_PASSWORD } from '../helpers/auth.helper';

const TEST_REAL_ESTATE_NAME = `E2E Test Inmobiliaria ${Date.now()}`;

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL no está definida');
  return url;
}

function getAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida');
  return key;
}

test.describe.serial('Real Estate — listado y detalle', () => {
  let realEstateId: string | null = null;

  test.beforeAll(async () => {
    // Crear una inmobiliaria via RPC para tener datos que ver
    const supabase = createClient(getSupabaseUrl(), getAnonKey());
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: E2E_TEST_EMAIL,
      password: E2E_TEST_PASSWORD,
    });
    if (signInError) throw new Error(`[real-estate] Error signing in: ${signInError.message}`);

    const { data, error } = await supabase.rpc('create_real_estate', {
      p_name: TEST_REAL_ESTATE_NAME,
      p_description: 'Inmobiliaria creada para tests e2e',
    });

    if (error) throw new Error(`[real-estate] Error creating real estate: ${error.message}`);
    if (!data?.success) throw new Error(`[real-estate] create_real_estate failed: ${data?.error}`);

    realEstateId = data.id as string;
  });

  test.afterAll(async () => {
    if (!realEstateId) return;
    // Limpiar via delete si existe — o ignorar, la DB se limpia sola
    console.log(`[real-estate] Test real estate ID: ${realEstateId}`);
  });

  test('página de listado carga con elementos principales', async ({ page }) => {
    await page.goto('/real-estate');

    // Título principal
    await expect(page.getByRole('heading', { name: 'Inmobiliarias' })).toBeVisible();

    // Sidebar de filtros
    await expect(page.getByRole('heading', { name: 'Filtros' })).toBeVisible();
    await expect(page.getByPlaceholder('Ej: Inmobiliaria ABC')).toBeVisible();

    // Muestra el contador de inmobiliarias
    await expect(page.getByText(/Mostrando \d+ inmobiliaria(s)?/)).toBeVisible();
  });

  test('filtra inmobiliarias por nombre', async ({ page }) => {
    await page.goto('/real-estate');

    // Escribir en el filtro de nombre
    const searchInput = page.getByPlaceholder('Ej: Inmobiliaria ABC');
    await searchInput.fill(TEST_REAL_ESTATE_NAME);

    // Esperar que se actualice la lista (debounce)
    await page.waitForTimeout(1000);

    // Verificar que nuestra inmobiliaria aparece
    await expect(page.getByText(TEST_REAL_ESTATE_NAME)).toBeVisible();
  });

  test('página de detalle de inmobiliaria carga correctamente', async ({ page }) => {
    expect(realEstateId).toBeTruthy();

    await page.goto(`/real-estate/${realEstateId}`);

    // Esperar que cargue el detalle
    await expect(page.getByRole('heading', { name: 'Reseñas y calificaciones' })).toBeVisible();

    // Nombre de la inmobiliaria
    await expect(page.getByText(TEST_REAL_ESTATE_NAME)).toBeVisible();

    // Tabs de contenido
    await expect(page.getByRole('tab', { name: 'Reseñas' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Experiencia' })).toBeVisible();
  });
});
