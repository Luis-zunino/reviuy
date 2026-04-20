import { createError, handleSupabaseError } from '@/lib';
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

const SAFE_REVIEW_SELECT = `
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

    const { data: insertedReviewBase, error: insertError } = await this.supabase
      .from('reviews')
      .insert({
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
      })
      .select(SAFE_REVIEW_SELECT)
      .single();

    if (insertError) {
      throw handleSupabaseError(insertError);
    }

    const reviewId = insertedReviewBase.id;

    if (review_rooms && review_rooms.length > 0) {
      const { error: roomsError } = await this.supabase.from('review_rooms').insert(
        review_rooms.map((room) => ({
          review_id: reviewId,
          room_type: room.room_type,
          area_m2: room.area_m2,
        }))
      );

      if (roomsError) {
        await this.supabase.from('reviews').delete().eq('id', reviewId).eq('user_id', user.id);
        throw handleSupabaseError(roomsError);
      }
    }

    const { data: insertedReview, error: fetchReviewError } = await this.supabase
      .from('reviews')
      .select(`${SAFE_REVIEW_SELECT}, review_rooms(*)`)
      .eq('id', reviewId)
      .single();

    if (fetchReviewError) {
      throw handleSupabaseError(fetchReviewError);
    }

    const insertedRooms = (insertedReview?.review_rooms || []) as ReviewRoom[];

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

    // Verificar ownership
    const { data: review, error: fetchError } = await this.supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (fetchError || !review) {
      return {
        success: false,
        message: 'Reseña no encontrada',
        error: 'NOT_FOUND',
      };
    }

    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user || review.user_id !== user.id) {
      return {
        success: false,
        message: 'No tienes permiso para actualizar esta reseña',
        error: 'FORBIDDEN',
      };
    }

    // Actualizar review
    const { error: updateError } = await this.supabase
      .from('reviews')
      .update(updateData)
      .eq('id', reviewId)
      .select()
      .single();

    if (updateError) {
      throw handleSupabaseError(updateError);
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

    // Obtener review completa
    const { data: completeReview, error: reviewError } = await this.supabase
      .from('reviews')
      .select(`${SAFE_REVIEW_SELECT}, review_rooms(*)`)
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

  async delete(input: DeletePropertyReviewInput): Promise<DeletePropertyReviewResult> {
    const { reviewId } = input;

    // Verificar ownership
    const { data: review, error: fetchError } = await this.supabase
      .from('reviews')
      .select('id, user_id, title')
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

    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user || review.user_id !== user.id) {
      return {
        success: false,
        message: 'No tienes permiso para eliminar esta reseña',
        error: 'FORBIDDEN',
      };
    }

    // Eliminar review (CASCADE eliminará rooms)
    const { error: deleteError } = await this.supabase
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
