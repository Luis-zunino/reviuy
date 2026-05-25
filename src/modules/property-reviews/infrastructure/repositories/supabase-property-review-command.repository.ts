import { randomUUID } from 'node:crypto';
import { createError, handleSupabaseError } from '@/lib/errors';
import type { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  CreatePropertyReviewInput,
  CreatePropertyReviewResult,
  UpdatePropertyReviewInput,
  UpdatePropertyReviewResult,
  DeletePropertyReviewInput,
  DeletePropertyReviewResult,
  VotePropertyReviewInput,
  VotePropertyReviewResult,
  ToggleFavoritePropertyReviewInput,
  ToggleFavoritePropertyReviewResult,
  PropertyReviewCommandRepository,
  ReviewRoom,
} from '../../domain';

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

const PUBLIC_REVIEW_SELECT = `
  id,
  real_estate_id,
  title,
  description,
  rating,
  property_type,
  address_text,
  address_osm_id,
  latitude,
  longitude,
  zone_rating,
  winter_comfort,
  summer_comfort,
  humidity,
  created_at,
  updated_at,
  apartment_number,
  real_estate_experience
`;

/** Obtener rooms de una review desde review_rooms. */
async function fetchReviewRooms(
  supabase: SupabaseServerClient,
  reviewId: string
): Promise<ReviewRoom[]> {
  const { data } = await supabase
    .from('review_rooms')
    .select('id, review_id, room_type, area_m2')
    .eq('review_id', reviewId)
    .order('id', { ascending: true });

  return (data ?? []) as ReviewRoom[];
}

export class SupabasePropertyReviewCommandRepository implements PropertyReviewCommandRepository {
  constructor(private readonly supabase: SupabaseServerClient) {}

  async create(input: CreatePropertyReviewInput): Promise<CreatePropertyReviewResult> {
    const { review_rooms, ...reviewData } = input;

    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      throw createError('UNAUTHORIZED');
    }

    const { data: rateLimitAllowed } = await this.supabase.rpc('check_rate_limit', {
      p_endpoint: 'create_review',
      p_max_requests: 5,
      p_window_minutes: 10,
    });

    if (rateLimitAllowed === false) {
      throw createError('RATE_LIMIT', 'Demasiadas reseñas. Intenta más tarde.');
    }

    // Generar UUID client-side para no necesitar RETURNING
    const reviewId = randomUUID();

    const { error: insertError } = await this.supabase.from('reviews').insert({
      id: reviewId,
      user_id: user.id,
      title: reviewData.title,
      description: reviewData.description,
      rating: reviewData.rating,
      address_text: reviewData.address_text,
      address_osm_id: reviewData.address_osm_id,
      latitude: reviewData.latitude,
      longitude: reviewData.longitude,
      real_estate_id: reviewData.real_estate_id ?? null,
      property_type: reviewData.property_type ?? null,
      zone_rating: reviewData.zone_rating ?? null,
      winter_comfort: reviewData.winter_comfort ?? null,
      summer_comfort: reviewData.summer_comfort ?? null,
      humidity: reviewData.humidity ?? null,
      real_estate_experience: reviewData.real_estate_experience ?? null,
      apartment_number: reviewData.apartment_number ?? null,
    });

    if (insertError) {
      throw handleSupabaseError(insertError);
    }

    if (review_rooms && review_rooms.length > 0) {
      const { error: roomsError } = await this.supabase.from('review_rooms').insert(
        review_rooms.map((room) => ({
          review_id: reviewId,
          room_type: room.room_type,
          area_m2: room.area_m2,
        }))
      );

      if (roomsError) {
        // Rollback vía RPC (SECURITY DEFINER, maneja ownership y SELECT revocado)
        await this.supabase.rpc('delete_review_safe', { review_id_param: reviewId });
        throw handleSupabaseError(roomsError);
      }
    }

    // Leer datos creados desde la vista pública
    const { data: insertedReview, error: fetchReviewError } = await this.supabase
      .from('reviews_public')
      .select(PUBLIC_REVIEW_SELECT)
      .eq('id', reviewId)
      .single();

    const insertedRooms = await fetchReviewRooms(this.supabase, reviewId);

    if (fetchReviewError) {
      // La review se creó pero no se pudo leer → devolver con datos mínimos
      return {
        success: true,
        message:
          insertedRooms.length > 0
            ? `Reseña creada exitosamente con ${insertedRooms.length} habitaciones`
            : 'Reseña creada',
        data: {
          id: reviewId,
          real_estate_id: reviewData.real_estate_id ?? null,
          title: reviewData.title,
          description: reviewData.description,
          rating: reviewData.rating,
          property_type: reviewData.property_type ?? null,
          address_text: reviewData.address_text,
          address_osm_id: reviewData.address_osm_id,
          latitude: reviewData.latitude,
          longitude: reviewData.longitude,
          zone_rating: reviewData.zone_rating ?? null,
          winter_comfort: reviewData.winter_comfort ?? null,
          summer_comfort: reviewData.summer_comfort ?? null,
          humidity: reviewData.humidity ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          apartment_number: reviewData.apartment_number ?? null,
          real_estate_experience: reviewData.real_estate_experience ?? null,
          review_rooms: insertedRooms,
        },
      };
    }

    return {
      success: true,
      message:
        insertedRooms.length > 0
          ? `Reseña creada exitosamente con ${insertedRooms.length} habitaciones`
          : 'Reseña creada',
      data: {
        ...insertedReview,
        review_rooms: insertedRooms,
      },
    };
  }

  async update(input: UpdatePropertyReviewInput): Promise<UpdatePropertyReviewResult> {
    const { reviewId, review_rooms, ...updateData } = input;

    // Verificar ownership desde la vista pública
    const { data: review, error: fetchError } = await this.supabase
      .from('reviews_public')
      .select('id, is_mine')
      .eq('id', reviewId)
      .single();

    if (fetchError || !review) {
      return {
        success: false,
        message: 'Reseña no encontrada',
        error: 'NOT_FOUND',
      };
    }

    if (!review.is_mine) {
      return {
        success: false,
        message: 'No tienes permiso para actualizar esta reseña',
        error: 'FORBIDDEN',
      };
    }

    // UPDATE via RPC (bypasea RETURNING * de PostgREST, que necesita SELECT)
    const rpcResult = await this.supabase.rpc('update_review', {
      p_review_id: reviewId,
      p_title: updateData.title ?? null,
      p_description: updateData.description ?? null,
      p_rating: updateData.rating ?? null,
      p_property_type: updateData.property_type ?? null,
      p_address_text: updateData.address_text ?? null,
      p_address_osm_id: updateData.address_osm_id ?? null,
      p_latitude: updateData.latitude ?? null,
      p_longitude: updateData.longitude ?? null,
      p_zone_rating: updateData.zone_rating ?? null,
      p_winter_comfort: updateData.winter_comfort ?? null,
      p_summer_comfort: updateData.summer_comfort ?? null,
      p_humidity: updateData.humidity ?? null,
      p_real_estate_id: updateData.real_estate_id ?? null,
      p_real_estate_experience: updateData.real_estate_experience ?? null,
      p_apartment_number: updateData.apartment_number ?? null,
    });

    const { data: updateResult, error: updateError } = rpcResult;

    if (updateError) {
      throw handleSupabaseError(updateError);
    }

    if (!updateResult?.success) {
      throw createError('DATABASE_ERROR', updateResult?.error ?? 'Error al actualizar la reseña');
    }

    // Actualizar rooms si existen
    if (review_rooms !== undefined && review_rooms.length > 0) {
      // Eliminar rooms existentes
      await this.supabase.from('review_rooms').delete().eq('review_id', reviewId);

      // Insertar nuevos rooms
      const roomsToInsert = review_rooms.map((room) => ({
        review_id: reviewId,
        room_type: room.room_type,
        area_m2: room.area_m2,
      }));

      const { error: roomsError } = await this.supabase.from('review_rooms').insert(roomsToInsert);

      if (roomsError) {
        throw handleSupabaseError(roomsError);
      }
    }

    // Obtener review completa desde la vista pública
    const { data: completeReview, error: reviewError } = await this.supabase
      .from('reviews_public')
      .select(PUBLIC_REVIEW_SELECT)
      .eq('id', reviewId)
      .single();

    const rooms = await fetchReviewRooms(this.supabase, reviewId);

    if (reviewError || !completeReview) {
      return {
        success: true,
        message: 'Reseña actualizada',
      };
    }

    return {
      success: true,
      message: 'Reseña actualizada',
      data: {
        ...completeReview,
        review_rooms: rooms,
      },
    };
  }

  async delete(input: DeletePropertyReviewInput): Promise<DeletePropertyReviewResult> {
    const { reviewId } = input;

    // Verificar ownership desde la vista pública
    const { data: review, error: fetchError } = await this.supabase
      .from('reviews_public')
      .select('id, is_mine')
      .eq('id', reviewId)
      .single();

    if (fetchError) {
      throw handleSupabaseError(fetchError);
    }

    if (!review) {
      return {
        success: false,
        message: 'Reseña no encontrada',
        error: 'NOT_FOUND',
      };
    }

    if (!review.is_mine) {
      return {
        success: false,
        message: 'No tienes permiso para eliminar esta reseña',
        error: 'FORBIDDEN',
      };
    }

    // Soft delete via RPC (SECURITY DEFINER, maneja ownership y auditoría internamente)
    const { error: deleteError } = await this.supabase.rpc('delete_review_safe', {
      review_id_param: reviewId,
    });

    if (deleteError) {
      throw handleSupabaseError(deleteError);
    }

    return {
      success: true,
      message: 'Reseña eliminada correctamente',
    };
  }

  async vote(input: VotePropertyReviewInput): Promise<VotePropertyReviewResult> {
    const { reviewId, voteType } = input;

    const { data, error } = await this.supabase.rpc('vote_review', {
      p_review_id: reviewId,
      p_vote_type: voteType,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return {
      success: true,
      message: 'Voto registrado',
      ...data,
    };
  }

  async toggleFavorite(
    input: ToggleFavoritePropertyReviewInput
  ): Promise<ToggleFavoritePropertyReviewResult> {
    const { reviewId } = input;

    const { data, error } = await this.supabase.rpc('toggle_favorite_review', {
      p_review_id: reviewId,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return {
      success: true,
      message: 'Favorito actualizado',
      favorited: data?.favorited,
      ...data,
    };
  }
}
