import { supabaseClient } from '@/lib/supabase-client';
import { updateReviewRooms } from './updateReviewRooms.api';
import type { UpdateReviewResponse, UpdateReviewApiRequest } from './types';
import { ReviewWithRoomsAndRealEstates } from '@/types';
import { parseSupabaseError } from '@/utils';

export const updateReview = async ({
  reviewId,
  updateData,
  userId,
}: UpdateReviewApiRequest): Promise<UpdateReviewResponse> => {
  const { data: review, error: fetchError } = await supabaseClient
    .from('reviews')
    .select('user_id')
    .eq('id', reviewId)
    .single();

  if (fetchError || !review) {
    return {
      success: false,
      message: 'No se pudo encontrar la reseña',
      error: fetchError?.message || 'Reseña no encontrada',
    };
  }

  if (review.user_id !== userId) {
    return {
      success: false,
      message: 'No tienes permisos para actualizar esta reseña',
      error: 'Permisos insuficientes',
    };
  }

  // Excluir campos que no deben actualizarse
  const { review_rooms, ...reviewData } = updateData;
  const { error: updateError } = await supabaseClient
    .from('reviews')
    .update(reviewData)
    .eq('id', reviewId)
    .select()
    .single();

  if (updateError) throw parseSupabaseError(updateError);

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

  const { data: completeReview, error: reviewWithRoomsError } = await supabaseClient
    .from('reviews')
    .select(`*,review_rooms (*)`)
    .eq('id', reviewId)
    .single();

  const reviewWithRooms: ReviewWithRoomsAndRealEstates = {
    ...completeReview!,
    review_rooms: completeReview?.review_rooms || [],
  };

  if (reviewWithRoomsError) throw parseSupabaseError(reviewWithRoomsError);

  return {
    success: true,
    message: `Reseña actualizada exitosamente${roomsUpdated ? ' (incluyendo habitaciones)' : ''}`,
    data: reviewWithRooms,
  };
};
