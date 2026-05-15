import { sessionMapped } from '@/utils';
import { supabaseClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ProfileAuthReadRepository,
  GetSessionOutput,
  VerifyAuthenticationOutput,
} from '../../domain';

export class SupabaseProfileAuthReadRepository implements ProfileAuthReadRepository {
  constructor(private readonly supabase: SupabaseClient = supabaseClient) {}

  async verifyAuthentication(): Promise<VerifyAuthenticationOutput> {
    const { data, error } = await this.supabase.auth.getUser();

    return { userId: data.user?.id ?? null, error };
  }

  async getSession(): Promise<GetSessionOutput> {
    const { data, error } = await this.supabase.auth.getSession();
    const session = sessionMapped(data.session);

    return { session, error };
  }
}
