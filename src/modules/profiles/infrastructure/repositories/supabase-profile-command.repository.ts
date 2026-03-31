import { createError } from '@/lib/errors';
import type {
  DeleteAccountCommand,
  DeleteAccountOutput,
  ProfileCommandRepository,
} from '../../domain';
import { createClient } from '@supabase/supabase-js';

export class SupabaseProfileCommandRepository implements ProfileCommandRepository {
  async deleteAccount(input: DeleteAccountCommand): Promise<DeleteAccountOutput> {
    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw createError(
        'INTERNAL_ERROR',
        'Configuración del servidor incompleta para eliminar cuenta.'
      );
    }

    if (!input.userId.trim()) {
      throw createError('INVALID_INPUT', 'No se pudo determinar la cuenta a eliminar.');
    }

    const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error } = await supabaseAdmin.auth.admin.deleteUser(input.userId);

    if (error) {
      throw createError('INTERNAL_ERROR', 'Hubo un error al intentar eliminar tu cuenta.');
    }

    return { success: true };
  }
}
