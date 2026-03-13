'use server';

import { withRateLimit, createError, handleSupabaseError } from '@/lib';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createRealEstateReviewSchema, formRealEstateSchema } from '@/schemas';
import { ZodError } from 'zod';

// ============================================================================
// CREATE REAL ESTATE REVIEW ACTION
// ============================================================================

// Nota: input es 'unknown' intencionalmente. Nunca confiar en datos del cliente.
// Zod validará y convertirá a tipo seguro.
export async function createRealEstateReviewAction(input: unknown) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  // 🔥 RATE LIMIT
  await withRateLimit(`create-re-review:${user.id}`, 'write');

  // Validar input
  let validatedData;
  try {
    validatedData = createRealEstateReviewSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      throw createError('VALIDATION_ERROR', `${firstError.path.join('.')}: ${firstError.message}`);
    }
    throw error;
  }

  const { error, data: review } = await supabase
    .from('real_estate_reviews')
    .insert([
      {
        ...validatedData,
        user_id: user.id,
      },
    ])
    .select('id, real_estate_id, title, description, rating, created_at, updated_at')
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }

  return {
    success: true,
    message: 'Reseña creada',
    data: review,
  };
}

// ============================================================================
// UPDATE REAL ESTATE REVIEW ACTION
// ============================================================================

export async function updateRealEstateReviewAction(reviewId: string, updateData: unknown) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  // 🔥 RATE LIMIT
  await withRateLimit(`update-re-review:${user.id}`, 'write');

  // Validar input
  let validatedData;
  try {
    validatedData = formRealEstateSchema.partial().parse(updateData);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      throw createError('VALIDATION_ERROR', `${firstError.path.join('.')}: ${firstError.message}`);
    }
    throw error;
  }

  const { error, data: review } = await supabase
    .from('real_estate_reviews')
    .update(validatedData)
    .eq('id', reviewId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }

  return {
    success: true,
    message: 'Reseña actualizada',
    data: review,
  };
}

// ============================================================================
// DELETE REAL ESTATE REVIEW ACTION
// ============================================================================

export async function deleteRealEstateReviewAction(reviewId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  // 🔥 RATE LIMIT
  await withRateLimit(`delete-re-review:${user.id}`, 'write');

  // Verificar ownership
  const { data: review, error: fetchError } = await supabase
    .from('real_estate_reviews')
    .select('id, user_id, title')
    .eq('id', reviewId)
    .single();

  if (fetchError) {
    throw handleSupabaseError(fetchError);
  }

  if (!review) {
    throw createError('NOT_FOUND', 'Reseña no encontrada');
  }

  if (review.user_id !== user.id) {
    throw createError('FORBIDDEN');
  }

  const { error: deleteError } = await supabase
    .from('real_estate_reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.id);

  if (deleteError) {
    throw handleSupabaseError(deleteError);
  }

  return {
    success: true,
    message: 'Reseña eliminada correctamente',
  };
}
