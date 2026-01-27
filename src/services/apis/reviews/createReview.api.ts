import { supabaseClient } from '@/lib/supabase-client';
import type { ReviewRoom } from '@/types';
import type { CreateReviewRequest, CreateReviewResponse } from './types';
import { parseSupabaseError } from '@/utils';

export const createReview = async ({
  data,
  userId,
}: CreateReviewRequest): Promise<CreateReviewResponse> => {
  if (!userId) {
    return {
      success: false,
      message: 'Debes iniciar sesión para crear una reseña',
      error: 'Usuario no autenticado',
    };
  }

  const { review_rooms, ...reviewData } = data;

  const { data: insertedReview, error: insertError } = await supabaseClient
    .from('reviews')
    .insert({
      ...reviewData,
      user_id: userId,
    })
    .select()
    .single();

  if (insertError) {
    return {
      success: false,
      message: 'Error al crear la reseña',
      error: insertError.message,
    };
  }

  let insertedRooms: ReviewRoom[] = [];

  if (review_rooms && review_rooms.length > 0 && insertedReview) {
    const roomsToInsert = review_rooms.map((room) => ({
      review_id: insertedReview.id,
      room_type: room.room_type,
      area_m2: room.area_m2,
    }));

    const { data: roomsData, error: roomsError } = await supabaseClient
      .from('review_rooms')
      .insert(roomsToInsert)
      .select();

    if (roomsError) {
      throw parseSupabaseError(roomsError);
    } else {
      insertedRooms = roomsData || [];
    }
  }

  return {
    success: true,
    message:
      'Reseña creada exitosamente' +
      (insertedRooms.length > 0 ? ' con ' + insertedRooms.length + ' habitaciones' : ''),
    data: {
      ...insertedReview,
      review_rooms: insertedRooms,
    },
  };
};
