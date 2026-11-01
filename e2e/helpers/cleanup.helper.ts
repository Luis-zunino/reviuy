import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase/supabase';
import { E2E_TEST_EMAIL, E2E_TEST_PASSWORD, getSupabaseAdmin } from './auth.helper';

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
    console.log(`[cleanup] Eliminando reseÃ±a ${reviewId} para osm_id=${osmId}`);
    await deleteReview(reviewId);
  } else {
    console.log(`[cleanup] No hay reseÃ±a activa del test user para osm_id=${osmId}`);
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

/**
 * Resetea las ventanas de rate limit (create_review, votes, etc.) del test user.
 *
 * El rate limit de la DB (check_rate_limit) persiste en public.rate_limits y no
 * sobrevive al usuario: corridas encadenadas de la suite agotan la ventana
 * (5 reseÃ±as / 10 min) y producen fallos no deterministas. El bypass SQL por
 * email fue eliminado a propÃ³sito (Fix S1), asÃ­ que se limpian solo las filas
 * del test user con service role (authenticated tiene DELETE revocado).
 */
export async function clearTestUserRateLimits(userId: string): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    console.warn('[cleanup] âš ï¸ Sin Supabase admin â€” rate limits no reseteados');
    return;
  }

  const { error } = await admin.from('rate_limits').delete().eq('user_id', userId);

  if (error) {
    console.warn('[cleanup] âš ï¸ No se pudieron resetear los rate limits:', error.message);
  } else {
    console.log('[cleanup] Rate limits del test user reseteados');
  }
}
