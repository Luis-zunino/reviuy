import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase/supabase';
import { E2E_TEST_EMAIL, E2E_TEST_PASSWORD } from './auth.helper';

/** Rechaza valores placeholder usados como fallback en CI */
function isValidValue(val: string | undefined): string | null {
  if (!val || val.includes('placeholder')) return null;
  return val;
}

function getSupabaseUrl(): string | null {
  return isValidValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function getAnonKey(): string | null {
  return isValidValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

let client: ReturnType<typeof createClient<Database>> | null = null;

async function ensureClient() {
  if (client) return client;

  const url = getSupabaseUrl();
  const key = getAnonKey();
  if (!url || !key) {
    throw new Error('[cleanup] Supabase env vars no disponibles (placeholder o ausentes)');
  }

  client = createClient<Database>(url, key);

  const { error } = await client.auth.signInWithPassword({
    email: E2E_TEST_EMAIL,
    password: E2E_TEST_PASSWORD,
  });

  if (error) {
    throw new Error(`[cleanup] Error signing in: ${error.message}`);
  }

  return client;
}

export async function deleteReview(reviewId: string): Promise<void> {
  const supabase = await ensureClient();
  const { error } = await supabase.rpc('delete_review_safe', { review_id_param: reviewId });

  if (error) {
    console.warn(`[cleanup] Error calling delete_review_safe for ${reviewId}:`, error.message);
  }
}

/**
 * Busca la reseña activa del test user para un address_osm_id.
 * Usa la vista `reviews_public` con el flag `is_mine` que depende de auth.uid().
 */
export async function findReviewByOsmId(osmId: string): Promise<string | null> {
  const supabase = await ensureClient();
  const { data, error } = await supabase
    .from('reviews_public')
    .select('id')
    .eq('address_osm_id', osmId)
    .eq('is_mine', true)
    .limit(1);

  if (error) {
    console.warn(`[cleanup] Error finding review for osm_id=${osmId}:`, error.message);
    return null;
  }

  return data?.[0]?.id ?? null;
}

/**
 * Elimina la reseña activa del test user para un address_osm_id (si existe).
 * Llama a findReviewByOsmId + deleteReview. Ideal para limpiar antes de tests.
 */
export async function deleteTestUserReviewForOsmId(osmId: string): Promise<void> {
  const reviewId = await findReviewByOsmId(osmId);
  if (reviewId) {
    console.log(`[cleanup] Eliminando reseña ${reviewId} para osm_id=${osmId}`);
    await deleteReview(reviewId);
  } else {
    console.log(`[cleanup] No hay reseña activa del test user para osm_id=${osmId}`);
  }
}

export async function findReviewByAddress(addressText: string): Promise<string | null> {
  const supabase = await ensureClient();
  const { data, error } = await supabase
    .from('reviews_public')
    .select('id')
    .eq('address_text', addressText)
    .limit(1);

  if (error) {
    console.warn(`[cleanup] Error finding review for "${addressText}":`, error.message);
    return null;
  }

  return data?.[0]?.id ?? null;
}
