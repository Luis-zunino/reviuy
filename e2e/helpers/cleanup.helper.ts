import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase/supabase';
import { E2E_TEST_EMAIL, E2E_TEST_PASSWORD } from './auth.helper';

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

let client: ReturnType<typeof createClient<Database>> | null = null;

async function ensureClient() {
  if (client) return client;
  client = createClient<Database>(getSupabaseUrl(), getAnonKey());

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
