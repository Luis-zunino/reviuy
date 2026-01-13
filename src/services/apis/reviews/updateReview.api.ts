import { supabaseClient } from '@/lib/supabase-client';
import { updateReviewRooms } from './updateReviewRooms.api';
import type { UpdateReviewResponse, UpdateReviewApiRequest } from './types';
import { ReviewWithRoomsAndRealEstates } from '@/types';

export const updateReview = async ({
  reviewId,
  updateData,
}: UpdateReviewApiRequest): Promise<UpdateReviewResponse> => {
  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    const { data: review, error: fetchError } = await supabaseClient
      .from('reviews')
      .select('id, user_id, title')
      .eq('id', reviewId)
      .single();

    if (fetchError || !review) {
      return {
        success: false,
        message: 'No se pudo encontrar la reseña',
        error: fetchError?.message || 'Reseña no encontrada',
      };
    }

    if (review.user_id !== user?.id) {
      return {
        success: false,
        message: 'No tienes permisos para actualizar esta reseña',
        error: 'Permisos insuficientes',
      };
    }

    // Excluir campos que no deben actualizarse
    const { review_rooms, user_id, id, created_at, ...reviewData } = updateData;
    const { error: updateError } = await supabaseClient
      .from('reviews')
      .update(reviewData)
      .eq('id', reviewId)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        message: 'Error al actualizar la reseña',
        error: updateError.message,
      };
    }

    let roomsUpdated = false;
    if (review_rooms !== undefined) {
      const roomsMapped = review_rooms.map((room) => ({
        area_m2: room.area_m2 ?? null,
        created_at: room.created_at ?? '',
        id: room.id ?? '',
        review_id: room.review_id ?? '',
        room_type: room.room_type ?? '',
        updated_at: room.updated_at ?? '',
      }));
      const roomsResult = await updateReviewRooms(reviewId, roomsMapped);
      roomsUpdated = roomsResult?.message ? Boolean(roomsResult?.details) : false;
    }

    const { data: completeReview } = await supabaseClient
      .from('reviews')
      .select(`*,review_rooms (*)`)
      .eq('id', reviewId)
      .single();

    const reviewWithRooms: ReviewWithRoomsAndRealEstates = {
      ...completeReview!,
      review_rooms: completeReview?.review_rooms || [],
    };

    return {
      success: true,
      message: `Reseña actualizada exitosamente${roomsUpdated ? ' (incluyendo habitaciones)' : ''}`,
      data: reviewWithRooms,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error inesperado al actualizar la reseña',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
