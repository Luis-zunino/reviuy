import { createClient } from '@supabase/supabase-js';
import type { Cookie } from '@playwright/test';

export const E2E_TEST_EMAIL = 'e2e-test@reviuy.qa';
export const E2E_TEST_PASSWORD = 'TestPassword123!';

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

function getServiceRoleKey(): string | null {
  return isValidValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseAdmin() {
  const url = getSupabaseUrl();
  const serviceKey = getServiceRoleKey();
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function getSupabaseClient() {
  const url = getSupabaseUrl();
  const key = getAnonKey();
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * Obtiene el project ref de la URL de Supabase.
 * Ej: "https://abc123.supabase.co" → "abc123"
 */
export function getProjectRef(): string | null {
  const url = getSupabaseUrl();
  if (!url) return null;
  const match = url.match(/https?:\/\/([^.]+)/);
  if (!match) return null;
  return match[1];
}

/**
 * Crea el usuario test si no existe.
 * Si ya existe, asegura que tenga password y metadata de términos.
 */
export async function ensureTestUser() {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const {
    data: { users },
  } = await admin.auth.admin.listUsers();
  const existing = users?.find((u) => u.email === E2E_TEST_EMAIL);

  if (existing) {
    await admin.auth.admin.updateUserById(existing.id, {
      password: E2E_TEST_PASSWORD,
      user_metadata: {
        ...existing.user_metadata,
        terms_accepted_at: existing.user_metadata?.terms_accepted_at ?? new Date().toISOString(),
        privacy_accepted_at:
          existing.user_metadata?.privacy_accepted_at ?? new Date().toISOString(),
        terms_version: existing.user_metadata?.terms_version ?? 'v1',
      },
    });
    return existing;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: E2E_TEST_EMAIL,
    password: E2E_TEST_PASSWORD,
    email_confirm: true,
    user_metadata: {
      terms_accepted_at: new Date().toISOString(),
      privacy_accepted_at: new Date().toISOString(),
      terms_version: 'v1',
    },
  });

  if (error) throw new Error(`Error creating test user: ${error.message}`);
  return data.user!;
}

/**
 * Obtiene una sesión para el usuario test.
 * Requiere que el provider "Email" esté habilitado en Supabase.
 */
export async function getTestSession() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: E2E_TEST_EMAIL,
    password: E2E_TEST_PASSWORD,
  });

  if (error) throw new Error(`Error signing in test user: ${error.message}`);
  if (!data.session) throw new Error('No session returned from signInWithPassword');

  return data.session;
}

/**
 * Construye las cookies de auth de Supabase SSR para inyectar en un browser context.
 *
 * Formato de @supabase/ssr v0.10:
 *   Cookie name:  sb-{projectRef}-auth-token
 *   Cookie value: base64-{base64url(JSON.stringify(session))}
 *
 * Si el valor excede ~3180 bytes, se divide en chunks:
 *   sb-{projectRef}-auth-token.0, sb-{projectRef}-auth-token.1, etc.
 */
export function buildAuthCookies(
  session: NonNullable<Awaited<ReturnType<typeof getTestSession>>> | null
): Cookie[] {
  if (!session) return [];
  const projectRef = getProjectRef();
  if (!projectRef) return [];
  const storageKey = `sb-${projectRef}-auth-token`;

  const rawValue = JSON.stringify({
    access_token: session.access_token,
    token_type: session.token_type,
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    refresh_token: session.refresh_token,
    user: session.user,
  });

  const encodedValue = `base64-${Buffer.from(rawValue).toString('base64url')}`;

  const baseCookie: Omit<Cookie, 'name' | 'value'> = {
    domain: 'localhost',
    path: '/',
    httpOnly: false,
    sameSite: 'Lax',
    secure: false,
    expires: session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
  };

  const MAX_CHUNK_SIZE = 3180;

  if (encodedValue.length <= MAX_CHUNK_SIZE) {
    return [{ ...baseCookie, name: storageKey, value: encodedValue }];
  }

  const chunks: Cookie[] = [];
  for (let i = 0; i < encodedValue.length; i += MAX_CHUNK_SIZE) {
    chunks.push({
      ...baseCookie,
      name: `${storageKey}.${chunks.length}`,
      value: encodedValue.slice(i, i + MAX_CHUNK_SIZE),
    });
  }
  return chunks;
}

export const AUTH_STORAGE_PATH = 'e2e/.auth/user.json';

/** @returns true si se inyectaron cookies, false si no había sesión disponible */
export async function injectAuthCookies(
  context: import('@playwright/test').BrowserContext
): Promise<boolean> {
  const session = await getTestSession();
  if (!session) return false;
  const cookies = buildAuthCookies(session);
  await context.addCookies(cookies);
  return true;
}
