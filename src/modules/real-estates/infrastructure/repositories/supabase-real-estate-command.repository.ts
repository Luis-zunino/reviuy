import { createError, handleSupabaseError } from '@/lib/errors';
import type { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  CreateRealEstateInput,
  RealEstate,
  VoteRealEstateInput,
  VoteRealEstateOutput,
  ToggleFavoriteRealEstateInput,
  ToggleFavoriteRealEstateOutput,
  CreateRealEstateReviewInput,
  CreateRealEstateReviewOutput,
  UpdateRealEstateReviewInput,
  UpdateRealEstateReviewOutput,
  DeleteRealEstateReviewInput,
  DeleteRealEstateReviewOutput,
  VoteRealEstateReviewInput,
  VoteRealEstateReviewOutput,
  RealEstateCommandRepository,
} from '../../domain';

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export class SupabaseRealEstateCommandRepository implements RealEstateCommandRepository {
  constructor(private readonly supabase: SupabaseServerClient) {}

  async create(input: CreateRealEstateInput): Promise<RealEstate> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      throw createError('UNAUTHORIZED', 'No autorizado');
    }

    const { data: result, error } = await this.supabase.rpc('create_real_estate', {
      p_name: input.real_estate_name,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    const rpcResult = result as {
      success: boolean;
      id?: string;
      error?: string;
    };

    if (!rpcResult.success) {
      throw createError('VALIDATION_ERROR', rpcResult.error ?? 'Error al crear la inmobiliaria');
    }

    if (!rpcResult.id) {
      throw createError('INTERNAL_ERROR', 'No se recibió el ID de la inmobiliaria creada');
    }

    const { data: estate, error: fetchError } = await this.supabase
      .from('real_estates_public')
      .select('id, name, description, review_count, rating, created_at, updated_at')
      .eq('id', rpcResult.id)
      .single();

    if (fetchError || !estate) {
      throw createError('INTERNAL_ERROR', 'Error al obtener la inmobiliaria creada');
    }

    return {
      id: estate.id,
      name: estate.name,
      description: estate.description,
      created_by: user.id,
      review_count: estate.review_count,
      rating: estate.rating,
      created_at: estate.created_at,
      updated_at: estate.updated_at,
      deleted_at: null,
    };
  }

  async vote(input: VoteRealEstateInput): Promise<VoteRealEstateOutput> {
    const { data, error } = await this.supabase.rpc('vote_real_estate', {
      p_real_estate_id: input.realEstateId,
      p_vote_type: input.voteType,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return (data as VoteRealEstateOutput) ?? {};
  }

  async toggleFavorite(
    input: ToggleFavoriteRealEstateInput
  ): Promise<ToggleFavoriteRealEstateOutput> {
    const { data, error } = await this.supabase.rpc('toggle_favorite_real_estate', {
      p_real_estate_id: input.realEstateId,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    if (typeof data === 'object' && data !== null) {
      return data as ToggleFavoriteRealEstateOutput;
    }

    return {
      success: false,
      error: 'Respuesta invalida del servidor',
    };
  }

  async createReview(input: CreateRealEstateReviewInput): Promise<CreateRealEstateReviewOutput> {
    const { data: result, error } = await this.supabase.rpc('create_real_estate_review', {
      p_real_estate_id: input.real_estate_id,
      p_title: input.title,
      p_description: input.description,
      p_rating: input.rating,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    const rpcResult = result as { success: boolean; review_id?: string; error?: string };

    if (!rpcResult.success) {
      return {
        success: false,
        message: rpcResult.error ?? 'Error al crear la reseña',
        error: rpcResult.error ?? 'UNKNOWN_ERROR',
      };
    }

    // Leer los datos creados desde la vista pública (con SELECT grant)
    const { data: review, error: fetchError } = await this.supabase
      .from('real_estate_reviews_public')
      .select('id, real_estate_id, title, description, rating, created_at, updated_at')
      .eq('id', rpcResult.review_id!)
      .single();

    if (fetchError || !review) {
      // La reseña se creó, pero no se pudo leer → devolver con los datos del input
      return {
        success: true,
        message: 'Reseña creada',
        data: {
          id: rpcResult.review_id!,
          real_estate_id: input.real_estate_id,
          title: input.title,
          description: input.description,
          rating: input.rating,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
    }

    return {
      success: true,
      message: 'Reseña creada',
      data: review,
    };
  }

  async updateReview(input: UpdateRealEstateReviewInput): Promise<UpdateRealEstateReviewOutput> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: 'No autorizado',
        error: 'UNAUTHORIZED',
      };
    }

    const { reviewId, title, description, rating } = input;

    // UPDATE via RPC (SECURITY DEFINER, maneja ownership y SELECT revocado)
    const { error: updateError } = await this.supabase.rpc('update_real_estate_review', {
      p_review_id: reviewId,
      p_title: title ?? null,
      p_description: description ?? null,
      p_rating: rating ?? null,
    });

    if (updateError) {
      throw handleSupabaseError(updateError);
    }

    // Leer datos actualizados desde la vista pública
    const { data: review, error: fetchError } = await this.supabase
      .from('real_estate_reviews_public')
      .select('id, real_estate_id, title, description, rating, created_at, updated_at')
      .eq('id', reviewId)
      .single();

    if (fetchError || !review) {
      return {
        success: true,
        message: 'Reseña actualizada',
      };
    }

    return {
      success: true,
      message: 'Reseña actualizada',
      data: review,
    };
  }

  async deleteReview(input: DeleteRealEstateReviewInput): Promise<DeleteRealEstateReviewOutput> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: 'No autorizado',
        error: 'UNAUTHORIZED',
      };
    }

    // Verificar ownership desde la vista pública
    const { data: review, error: fetchError } = await this.supabase
      .from('real_estate_reviews_public')
      .select('id, title, is_mine')
      .eq('id', input.reviewId)
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

    // Soft delete via RPC (SECURITY DEFINER, maneja ownership y SELECT revocado)
    const { error: deleteError } = await this.supabase.rpc('delete_real_estate_review_safe', {
      p_review_id: input.reviewId,
    });

    if (deleteError) {
      throw handleSupabaseError(deleteError);
    }

    return {
      success: true,
      message: 'Reseña eliminada correctamente',
    };
  }

  async voteReview(input: VoteRealEstateReviewInput): Promise<VoteRealEstateReviewOutput> {
    const { data, error } = await this.supabase.rpc('vote_real_estate_review', {
      p_real_estate_review_id: input.reviewId,
      p_vote_type: input.voteType,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return (data as VoteRealEstateReviewOutput) ?? {};
  }
}
