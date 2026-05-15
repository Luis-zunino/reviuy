import { createError, handleSupabaseError } from '@/lib/errors';
import { supabaseClient } from '@/lib/supabase/client';
import type {
  GetRealEstateByIdInput,
  GetRealEstateByIdOutput,
  GetAllRealEstateReviewsInput,
  GetAllRealEstateReviewsOutput,
  GetRealEstateReviewByIdInput,
  GetRealEstateReviewByIdOutput,
  GetRealEstateReviewByUserIdInput,
  GetRealEstateReviewByUserIdOutput,
  GetUserRealEstateVoteInput,
  GetUserRealEstateVoteOutput,
  SearchRealEstatesInput,
  SearchRealEstatesOutput,
  GetAllRealEstatesPaginatedInput,
  GetAllRealEstatesPaginatedOutput,
  GetUserFavoriteRealEstatesOutput,
  IsRealEstateFavoriteInput,
  HasUserReportedRealEstateInput,
  HasUserReportedRealEstateReviewInput,
  RealEstateReadRepository,
} from '../../domain';

type SupabaseBrowserClient = typeof supabaseClient;

export class SupabaseRealEstateReadRepository implements RealEstateReadRepository {
  constructor(private readonly supabase: SupabaseBrowserClient) {}

  async getById({ id }: GetRealEstateByIdInput): Promise<GetRealEstateByIdOutput> {
    const { data, error } = await this.supabase
      .from('real_estates_with_votes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  }

  async getAllReviews({
    id,
    limit,
  }: GetAllRealEstateReviewsInput): Promise<GetAllRealEstateReviewsOutput> {
    let query = this.supabase
      .from('real_estate_reviews_with_votes_public')
      .select('*')
      .eq('real_estate_id', id)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw handleSupabaseError(error);
    return data || [];
  }

  async getReviewById({
    reviewId,
  }: GetRealEstateReviewByIdInput): Promise<GetRealEstateReviewByIdOutput> {
    const { data, error } = await this.supabase
      .from('real_estate_reviews_with_votes_public')
      .select('*')
      .eq('id', reviewId)
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (error) throw handleSupabaseError(error);
    return data;
  }

  async getReviewByUserId({
    realEstateId,
  }: GetRealEstateReviewByUserIdInput): Promise<GetRealEstateReviewByUserIdOutput> {
    const { data, error } = await this.supabase.rpc('get_real_estate_review_by_user', {
      p_real_estate_id: realEstateId,
    });

    if (error) throw handleSupabaseError(error);

    return data?.[0] ?? null;
  }

  async getUserVote({
    realEstateId,
  }: GetUserRealEstateVoteInput): Promise<GetUserRealEstateVoteOutput> {
    const { data, error } = await this.supabase.rpc('get_user_real_estate_vote', {
      p_real_estate_id: realEstateId,
    });

    if (error) throw handleSupabaseError(error);

    return data as GetUserRealEstateVoteOutput;
  }

  async search({ query, limit = 10 }: SearchRealEstatesInput): Promise<SearchRealEstatesOutput> {
    if (!query || query.length < 3) return [];

    const { data, error } = await this.supabase
      .from('real_estates_with_votes')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(limit)
      .order('name');

    if (error) throw handleSupabaseError(error);

    return data || [];
  }

  async getRealEstatesWithVotesPaginated({
    limit = 10,
    offset = 0,
    search,
    rating,
  }: GetAllRealEstatesPaginatedInput): Promise<GetAllRealEstatesPaginatedOutput> {
    const start = offset;
    const end = offset + limit - 1;

    let query = this.supabase.from('real_estates_with_votes').select('*', { count: 'exact' });

    if (search && search.length >= 3) {
      query = query.ilike('name', `%${search}%`);
    }

    if (rating && rating > 0) {
      query = query.gte('rating', rating);
    }

    const { data, error } = await query.order('created_at', { ascending: false }).range(start, end);

    if (error) throw handleSupabaseError(error);

    const items = data || [];
    const nextOffset = items.length < limit ? null : offset + items.length;

    return { data: items, nextOffset };
  }

  async getUserFavorites(): Promise<GetUserFavoriteRealEstatesOutput> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    const userId = user?.id ?? null;

    if (!userId) {
      throw createError('UNAUTHORIZED', 'Usuario no autenticado');
    }

    const { data, error } = await this.supabase
      .from('real_estate_favorites')
      .select(
        `
        real_estate_id,
        real_estates:real_estates_with_votes (
          *
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw handleSupabaseError(error);

    return (
      data
        ?.map((item) => item.real_estates)
        .filter((item): item is GetUserFavoriteRealEstatesOutput[number] => item !== null) ?? []
    );
  }

  async isFavorite({ realEstateId }: IsRealEstateFavoriteInput): Promise<boolean> {
    const { data, error } = await this.supabase.rpc('is_real_estate_favorite', {
      p_real_estate_id: realEstateId,
    });

    if (error) throw handleSupabaseError(error);

    return Boolean(data);
  }

  async hasUserReported({ realEstateId }: HasUserReportedRealEstateInput): Promise<boolean> {
    if (!realEstateId) return false;

    const { data, error } = await this.supabase.rpc('has_user_reported_real_estate', {
      p_real_estate_id: realEstateId,
    });

    if (error) throw handleSupabaseError(error);

    return data;
  }

  async hasUserReportedReview({
    reviewId,
  }: HasUserReportedRealEstateReviewInput): Promise<boolean> {
    const { data, error } = await this.supabase.rpc('has_user_reported_real_estate_review', {
      p_review_id: reviewId,
    });

    if (error) throw handleSupabaseError(error);

    return data;
  }
}
