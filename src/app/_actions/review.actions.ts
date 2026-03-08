'use server';

import { withRateLimit, createError, handleSupabaseError } from '@/lib';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { ReviewRoom } from '@/types';
import { backendReviewSchema } from '@/schemas';
import { ZodError } from 'zod';
import { CreateReviewData } from '@/services';

type CreateReviewRpcResult = {
  success: boolean;
  review_id: string | null;
  message: string | null;
  error: string | null;
};

// ============================================================================
// CREATE REVIEW ACTION
// ============================================================================

// Nota: input es 'unknown' intencionalmente. Nunca confiar en datos del cliente.
// Zod validará y convertirá a tipo seguro.
export async function createReviewAction(input: CreateReviewData) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  // 🔥 RATE LIMIT
  await withRateLimit(`create-review:${user.id}`, 'write');

  // Normalizar y validar input
  const rawData = input;

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

  const { data: rpcData, error: rpcError } = await supabase.rpc('create_review', {
    p_title: restData.title,
    p_description: restData.description,
    p_rating: restData.rating,
    p_address_text: restData.address_text,
    p_address_osm_id: restData.address_osm_id,
    p_latitude: restData.latitude,
    p_longitude: restData.longitude,
    p_real_estate_id: restData.real_estate_id ?? null,
    p_property_type: restData.property_type ?? null,
    p_zone_rating: restData.zone_rating ?? null,
    p_winter_comfort: restData.winter_comfort ?? null,
    p_summer_comfort: restData.summer_comfort ?? null,
    p_humidity: restData.humidity ?? null,
    p_real_estate_experience: restData.real_estate_experience ?? null,
    p_apartment_number: restData.apartment_number ?? null,
    p_review_rooms: review_rooms ?? [],
  });

  if (rpcError) {
    throw handleSupabaseError(rpcError);
  }

  const result = rpcData as CreateReviewRpcResult | null;

  if (!result?.success || !result.review_id) {
    throw createError(
      'VALIDATION_ERROR',
      result?.error || result?.message || 'No se pudo crear la reseña'
    );
  }

  const { data: insertedReview, error: fetchReviewError } = await supabase
    .from('reviews')
    .select('*, review_rooms(*)')
    .eq('id', result.review_id)
    .single();

  if (fetchReviewError) {
    throw handleSupabaseError(fetchReviewError);
  }

  const insertedRooms = (insertedReview?.review_rooms || []) as ReviewRoom[];

  return {
    success: true,
    message: result.message || 'Reseña creada',
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
  await withRateLimit(`update-review:${user.id}`, 'write');

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
  await withRateLimit(`delete-review:${user.id}`, 'write');

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
