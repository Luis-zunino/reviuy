'use server';

import { withRateLimit, createError, handleSupabaseError } from '@/lib';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { ReviewRoom } from '@/types';
import { backendReviewSchema } from '@/schemas';
import { ZodError } from 'zod';

// ============================================================================
// CREATE REVIEW ACTION
// ============================================================================

// Nota: input es 'unknown' intencionalmente. Nunca confiar en datos del cliente.
// Zod validará y convertirá a tipo seguro.
export async function createReviewAction(input: unknown) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  // 🔥 RATE LIMIT
  const allowed = await withRateLimit(`create-review:${user.id}`, 'write');
  if (!allowed) {
    throw createError('RATE_LIMIT');
  }

  // Normalizar y validar input
  const rawData =
    typeof input === 'object' && input !== null && 'data' in input ? (input as any).data : input;

  let reviewData;
  try {
    reviewData = backendReviewSchema.parse(rawData);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      throw createError('VALIDATION_ERROR', `${firstError.path.join('.')}: ${firstError.message}`);
    }
    throw error;
  }

  const { review_rooms, ...restData } = reviewData || {};

  // Insertar review
  const { data: insertedReview, error: insertError } = await supabase
    .from('reviews')
    .insert({
      ...restData,
      user_id: user.id,
    })
    .select()
    .single();

  if (insertError) {
    throw handleSupabaseError(insertError);
  }

  let insertedRooms: ReviewRoom[] = [];

  // Insertar rooms si existen
  if (review_rooms && review_rooms.length > 0 && insertedReview) {
    const roomsToInsert = review_rooms.map((room: any) => ({
      review_id: insertedReview.id,
      room_type: room.room_type,
      area_m2: room.area_m2,
    }));

    const { data: roomsData, error: roomsError } = await supabase
      .from('review_rooms')
      .insert(roomsToInsert)
      .select();

    if (roomsError) {
      throw handleSupabaseError(roomsError);
    }

    insertedRooms = roomsData || [];
  }

  return {
    success: true,
    message:
      'Reseña creada' +
      (insertedRooms.length > 0 ? ' con ' + insertedRooms.length + ' habitaciones' : ''),
    data: {
      ...insertedReview,
      review_rooms: insertedRooms,
    },
  };
}

// ============================================================================
// UPDATE REVIEW ACTION
// ============================================================================

export async function updateReviewAction(reviewId: string, updateData: unknown) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  // 🔥 RATE LIMIT
  const allowed = await withRateLimit(`update-review:${user.id}`, 'write');
  if (!allowed) {
    throw createError('RATE_LIMIT');
  }

  // Validar input con schema de backend
  let validatedData;
  try {
    validatedData = backendReviewSchema.partial().parse(updateData);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      throw createError('VALIDATION_ERROR', `${firstError.path.join('.')}: ${firstError.message}`);
    }
    throw createError('VALIDATION_ERROR', 'Datos inválidos');
  }

  // Verificar ownership
  const { data: review, error: fetchError } = await supabase
    .from('reviews')
    .select('user_id')
    .eq('id', reviewId)
    .single();

  if (fetchError || !review) {
    throw createError('NOT_FOUND', 'Reseña no encontrada');
  }

  if (review.user_id !== user.id) {
    throw createError('FORBIDDEN');
  }

  // Actualizar review
  const { review_rooms, ...reviewDataToUpdate } = validatedData;
  const { error: updateError } = await supabase
    .from('reviews')
    .update(reviewDataToUpdate)
    .eq('id', reviewId)
    .select()
    .single();

  if (updateError) {
    throw handleSupabaseError(updateError);
  }

  // Actualizar rooms si existen
  if (review_rooms !== undefined && review_rooms.length > 0) {
    // Eliminar rooms existentes
    await supabase.from('review_rooms').delete().eq('review_id', reviewId);

    // Insertar nuevos rooms
    const roomsToInsert = review_rooms.map((room) => ({
      review_id: reviewId,
      room_type: room.room_type,
      area_m2: room.area_m2,
    }));

    const { error: roomsError } = await supabase.from('review_rooms').insert(roomsToInsert);

    if (roomsError) {
      throw handleSupabaseError(roomsError);
    }
  }

  // Obtener review completa
  const { data: completeReview, error: reviewError } = await supabase
    .from('reviews')
    .select(`*,review_rooms (*), real_estates(*)`)
    .eq('id', reviewId)
    .single();

  if (reviewError) {
    throw handleSupabaseError(reviewError);
  }

  return {
    success: true,
    message: 'Reseña actualizada',
    data: completeReview,
  };
}

// ============================================================================
// DELETE REVIEW ACTION
// ============================================================================

export async function deleteReviewAction(reviewId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  // 🔥 RATE LIMIT
  const allowed = await withRateLimit(`delete-review:${user.id}`, 'write');
  if (!allowed) {
    throw createError('RATE_LIMIT');
  }

  // Verificar ownership
  const { data: review, error: fetchError } = await supabase
    .from('reviews')
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

  // Eliminar review (CASCADE eliminará rooms)
  const { error: deleteError } = await supabase
    .from('reviews')
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
