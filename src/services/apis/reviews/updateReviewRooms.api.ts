import type { ReviewRoom } from '@/types';
import { supabaseClient } from '@/lib/supabase-client';
import { PostgrestError } from '@supabase/supabase-js';

export const updateReviewRooms = async (
  reviewId: string,
  rooms: ReviewRoom[]
): Promise<null | PostgrestError | { details: boolean; message: string }> => {
  const { error: deleteError } = await supabaseClient
    .from('review_rooms')
    .delete()
    .eq('review_id', reviewId);

  if (deleteError) throw deleteError;

  if (rooms.length > 0) {
    const roomsToInsert = rooms.map((room) => ({
      review_id: reviewId,
      room_type: room.room_type,
      area_m2: room.area_m2,
    }));

    const { error: insertError } = await supabaseClient.from('review_rooms').insert(roomsToInsert);

    if (insertError) throw insertError;
    return { details: true, message: 'Reseña actualizada exitosamente' };
  }

  return { details: true, message: 'Reseña actualizada exitosamente' };
};
