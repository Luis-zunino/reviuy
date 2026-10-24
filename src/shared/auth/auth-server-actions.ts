'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { withRateLimit } from '@/lib/redis';
import { getClientIp } from './get-client-ip.util';
import { getServerOrigin } from './get-server-origin.util';

const CALLBACK_PATH = '/auth/callback';

export async function signInWithEmailServer(email: string): Promise<{ success: boolean }> {
  const supabase = await createSupabaseServerClient();
  const origin = await getServerOrigin();

  await withRateLimit(`auth:email:${email.toLowerCase()}`, 'auth_email');

  const { error } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase(),
    options: {
      // Debe ser absoluto: en server-side, un redirect relativo hace que
      // Supabase use el Site URL del dashboard (el dominio deployado).
      emailRedirectTo: `${origin}${CALLBACK_PATH}`,
    },
  });

  if (error) {
    throw error;
  }

  return { success: true };
}

export async function signInWithGoogleServer(): Promise<{ url: string }> {
  const supabase = await createSupabaseServerClient();
  const origin = await getServerOrigin();

  // Key por IP: una key global permitiría a un único atacante agotar
  // el OAuth de Google para todos los usuarios (DoS de disponibilidad).
  const ip = await getClientIp();

  await withRateLimit(`auth:google:${ip}`, 'auth_oauth');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}${CALLBACK_PATH}`,
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
