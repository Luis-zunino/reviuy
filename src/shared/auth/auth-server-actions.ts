'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { withRateLimit } from '@/lib/redis';
import { createError } from '@/lib/errors';
import { buildSiteUrl } from '@/lib/site-url';
import { getClientIp } from './get-client-ip.util';

// GoTrue solo acepta redirect_to ABSOLUTOS que coincidan con site_url o la
// allowlist; una ruta relativa se ignora y el link cae en la raíz del sitio,
// salteando /auth/callback (y con él la verificación de términos).
const getAuthCallbackUrl = () => buildSiteUrl('/auth/callback');

// Las server actions reciben argumentos arbitrarios: se valida en el servidor
// aunque el formulario ya valide en el cliente.
const emailSchema = z.string().trim().toLowerCase().max(254).pipe(z.email());

export async function signInWithEmailServer(email: string): Promise<{ success: boolean }> {
  const parsedEmail = emailSchema.safeParse(email);

  if (!parsedEmail.success) {
    throw createError('INVALID_INPUT', 'El formato del email es inválido');
  }

  const normalizedEmail = parsedEmail.data;
  const supabase = await createSupabaseServerClient();

  await withRateLimit(`auth:email:${normalizedEmail}`, 'auth_email');

  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      emailRedirectTo: getAuthCallbackUrl(),
    },
  });

  if (error) {
    throw error;
  }

  return { success: true };
}

export async function signInWithGoogleServer(): Promise<{ url: string }> {
  const supabase = await createSupabaseServerClient();

  // Clave por IP: con una clave global, un solo cliente agotaba el cupo y
  // bloqueaba el login con Google para todos los usuarios.
  await withRateLimit(`auth:google:${await getClientIp()}`, 'auth_oauth');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getAuthCallbackUrl(),
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error('No se pudo obtener la URL de autenticación de Google');
  }

  return { url: data.url };
}

export async function signOutServer(): Promise<{ success: boolean }> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  return { success: true };
}
