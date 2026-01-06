import { supabaseClient } from '@/lib/supabase-client';
import type { ReviewInsert, ReviewRoom } from '@/types';
import type { User } from '@supabase/supabase-js';
import type { CreateReviewResponse } from './types';

export interface CreateReviewData extends ReviewInsert {
  review_rooms?: Omit<ReviewRoom, 'id' | 'review_id' | 'created_at' | 'updated_at'>[];
}

export interface CreateReviewRequest {
  createReviewData: CreateReviewData;
  user?: User | null;
}

export const createReview = async ({
  createReviewData,
  user,
}: CreateReviewRequest): Promise<CreateReviewResponse> => {
  try {
    if (!user) {
      return {
        success: false,
        message: 'Debes iniciar sesión para crear una reseña',
        error: 'Usuario no autenticado',
      };
    }

    const { review_rooms, ...reviewData } = createReviewData;

    const { data: insertedReview, error: insertError } = await supabaseClient
      .from('reviews')
      .insert({
        ...reviewData,
        user_id: user.id,
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
        console.error('Error insertando rooms:', roomsError);
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
  } catch (error) {
    return {
      success: false,
      message: 'Error inesperado al crear la reseña',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
