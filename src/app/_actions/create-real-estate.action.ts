'use server';

import { withRateLimit, createError, handleSupabaseError } from '@/lib';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { formCreateRealEstateSchema } from '@/schemas';
import { ZodError } from 'zod';

// Nota: input es 'unknown' intencionalmente. Nunca confiar en datos del cliente.
// Zod validará y convertirá a tipo seguro.
export async function createRealEstateAction(input: unknown) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  // 🔥 RATE LIMIT
  const allowed = await withRateLimit(`create-real-estate:${user.id}`, 'write');

  if (!allowed) {
    throw createError('RATE_LIMIT');
  }

  // Validar input
  let validatedData;
  try {
    validatedData = formCreateRealEstateSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      throw createError('VALIDATION_ERROR', `${firstError.path.join('.')}: ${firstError.message}`);
    }
    throw error;
  }

  // Insertar en la base de datos - mapear real_estate_name a name
  const { data: realEstate, error } = await supabase
    .from('real_estates')
    .insert({
      name: validatedData.real_estate_name,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }

  return realEstate;
}
