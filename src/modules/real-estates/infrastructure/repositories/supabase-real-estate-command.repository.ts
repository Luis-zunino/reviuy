import { handleSupabaseError } from '@/lib';
import type { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  CreateRealEstateInput,
  CreateRealEstateOutput,
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

  async create(input: CreateRealEstateInput): Promise<CreateRealEstateOutput> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      throw new Error('UNAUTHORIZED');
    }

    const { data: realEstate, error } = await this.supabase
      .from('real_estates')
      .insert({
        name: input.real_estate_name,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error);
    }

    return realEstate;
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

    const { error, data: review } = await this.supabase
      .from('real_estate_reviews')
      .insert([
        {
          ...input,
          user_id: user.id,
        },
      ])
      .select('id, real_estate_id, title, description, rating, created_at, updated_at')
      .single();

    if (error) {
      throw handleSupabaseError(error);
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

    const { reviewId, ...dataToUpdate } = input;

    const { error, data: review } = await this.supabase
      .from('real_estate_reviews')
      .update(dataToUpdate)
      .eq('id', reviewId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error);
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

    const { data: review, error: fetchError } = await this.supabase
      .from('real_estate_reviews')
      .select('id, user_id, title')
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

    if (review.user_id !== user.id) {
      return {
        success: false,
        message: 'No tienes permiso para eliminar esta reseña',
        error: 'FORBIDDEN',
      };
    }

    const { error: deleteError } = await this.supabase
      .from('real_estate_reviews')
      .delete()
      .eq('id', input.reviewId)
      .eq('user_id', user.id);

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
