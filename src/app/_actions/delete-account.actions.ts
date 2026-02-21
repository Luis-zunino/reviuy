'use server';

import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const deleteAccountAction = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Debes iniciar sesión para eliminar tu cuenta.');
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
    throw new Error('Hubo un error al intentar eliminar tu cuenta.');
  }
};
