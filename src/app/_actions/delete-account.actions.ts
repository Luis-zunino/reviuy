'use server';

import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createError, withRateLimit } from '@/lib';

const MAX_SESSION_AGE_MS = 30 * 60 * 1000;

export const deleteAccountAction = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw createError('UNAUTHORIZED', 'Debes iniciar sesión para eliminar tu cuenta.');
  }

  // Rate limit estricto para operación sensible.
  await withRateLimit(`delete-account:${user.id}`, 'sensitive');

  const lastSignInAt = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null;
  const hasRecentSession =
    lastSignInAt instanceof Date &&
    !Number.isNaN(lastSignInAt.getTime()) &&
    Date.now() - lastSignInAt.getTime() <= MAX_SESSION_AGE_MS;

  if (!hasRecentSession) {
    throw createError(
      'UNAUTHORIZED',
      'Por seguridad, vuelve a iniciar sesión y reintenta eliminar tu cuenta.'
    );
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw createError(
      'INTERNAL_ERROR',
      'Configuración del servidor incompleta para eliminar cuenta.'
    );
  }

  // Necesario porque un usuario normal no puede borrarse a sí mismo de auth.users directamente por seguridad
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Eliminar el usuario (Postgres disparará ON DELETE SET NULL en las reseñas)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    throw createError('INTERNAL_ERROR', 'Hubo un error al intentar eliminar tu cuenta.');
  }
};
