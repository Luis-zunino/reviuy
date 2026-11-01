import { createError } from '@/lib/errors';
import type {
  AcceptTermsCommand,
  AcceptTermsOutput,
  DeleteAccountCommand,
  DeleteAccountOutput,
  ProfileCommandRepository,
} from '../../domain';
import { createClient } from '@supabase/supabase-js';

export class SupabaseProfileCommandRepository implements ProfileCommandRepository {
  private adminClient?: ReturnType<typeof createClient>;

  private getAdminClient() {
    if (this.adminClient) {
      return this.adminClient;
    }

    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw createError(
        'INTERNAL_ERROR',
        'Configuración del servidor incompleta para operaciones de administrador.'
      );
    }

    this.adminClient = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    return this.adminClient;
  }

  async deleteAccount(input: DeleteAccountCommand): Promise<DeleteAccountOutput> {
    if (!input.userId.trim()) {
      throw createError('INVALID_INPUT', 'No se pudo determinar la cuenta a eliminar.');
    }

    const supabaseAdmin = this.getAdminClient();

    const { error } = await supabaseAdmin.auth.admin.deleteUser(input.userId);

    if (error) {
      throw createError('INTERNAL_ERROR', 'Hubo un error al intentar eliminar tu cuenta.');
    }

    return { success: true };
  }

  async acceptTerms(input: AcceptTermsCommand): Promise<AcceptTermsOutput> {
    // user_metadata NO sirve como evidencia: es editable por el propio usuario
    // vía supabaseClient.auth.updateUser() desde el cliente con la anon key.
    // La firma del consentimiento se guarda en app_metadata (solo service role).
    const supabaseAdmin = this.getAdminClient();

    // Se preserva el app_metadata existente (provider/providers, custom
    // claims): no se asume la semántica de merge del admin API.
    const {
      data: { user },
      error: readError,
    } = await supabaseAdmin.auth.admin.getUserById(input.userId);

    if (readError || !user) {
      throw createError('INTERNAL_ERROR', 'No se pudo registrar tu aceptación de términos.');
    }

    const appMetadata = {
      ...(user.app_metadata ?? {}),
      terms_accepted_at: new Date().toISOString(),
      terms_version: input.version,
    };

    const { error } = await supabaseAdmin.auth.admin.updateUserById(input.userId, {
      app_metadata: appMetadata,
    });

    if (error) {
      throw createError('INTERNAL_ERROR', 'No se pudo registrar tu aceptación de términos.');
    }

    return { success: true };
  }
}
