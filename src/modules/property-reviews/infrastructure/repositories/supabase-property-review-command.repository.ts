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

type CreateReviewRpcResult = {
  success: boolean;
  review_id: string | null;
  message: string | null;
  error: string | null;
};

export class SupabasePropertyReviewCommandRepository implements PropertyReviewCommandRepository {
  constructor(private readonly supabase: SupabaseServerClient) {}

  async create(input: CreatePropertyReviewInput): Promise<CreatePropertyReviewResult> {
    const { review_rooms, ...reviewData } = input;

    const { data: rpcData, error: rpcError } = await this.supabase.rpc('create_review', {
      p_title: reviewData.title,
      p_description: reviewData.description,
      p_rating: reviewData.rating,
      p_address_text: reviewData.address_text,
      p_address_osm_id: reviewData.address_osm_id,
      p_latitude: reviewData.latitude,
      p_longitude: reviewData.longitude,
      p_real_estate_id: reviewData.real_estate_id ?? null,
      p_property_type: reviewData.property_type ?? null,
      p_zone_rating: reviewData.zone_rating ?? null,
      p_winter_comfort: reviewData.winter_comfort ?? null,
      p_summer_comfort: reviewData.summer_comfort ?? null,
      p_humidity: reviewData.humidity ?? null,
      p_real_estate_experience: reviewData.real_estate_experience ?? null,
      p_apartment_number: reviewData.apartment_number ?? null,
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

    const { data: insertedReview, error: fetchReviewError } = await this.supabase
      .from('reviews_public')
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
