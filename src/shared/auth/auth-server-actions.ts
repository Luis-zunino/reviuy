'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { withRateLimit } from '@/lib/redis';

export async function signInWithEmailServer(email: string): Promise<{ success: boolean }> {
  const supabase = await createSupabaseServerClient();

  await withRateLimit(`auth:email:${email.toLowerCase()}`, 'auth_email');

  const { error } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase(),
    options: {
      emailRedirectTo: '/auth/callback',
    },
  });

  if (error) {
    throw error;
  }

  return { success: true };
}

export async function signInWithGoogleServer(): Promise<{ url: string }> {
  const supabase = await createSupabaseServerClient();

  await withRateLimit('auth:google', 'auth_oauth');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: '/auth/callback',
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