import { handleSupabaseError } from '@/lib/errors';
import { supabaseClient } from '@/lib/supabase/client';
import type {
  GetReviewsByAddressInput,
  PropertyReviewAddressReadModel,
  GetReviewByIdInput,
  GetReviewByIdOutput,
  GetReviewsByUserIdInput,
  GetReviewsByUserIdOutput,
  GetReviewsByRealEstateIdInput,
  GetReviewsByRealEstateIdOutput,
  GetUserReviewVoteInput,
  GetUserReviewVoteOutput,
  GetUserFavoriteReviewsInput,
  GetUserFavoriteReviewsOutput,
  IsReviewFavoriteInput,
  IsReviewFavoriteOutput,
  CheckUserReviewForAddressInput,
  CheckUserReviewForAddressOutput,
  HasUserReportedReviewInput,
  HasUserReportedReviewOutput,
} from '../../domain';
import type { PropertyReviewReadRepository } from '../../domain';

type SupabaseBrowserClient = typeof supabaseClient;

export class SupabasePropertyReviewReadRepository implements PropertyReviewReadRepository {
  constructor(private readonly supabase: SupabaseBrowserClient) {}

  async getByAddress({
    osmId,
  }: GetReviewsByAddressInput): Promise<PropertyReviewAddressReadModel[]> {
    const { data, error } = await this.supabase
      .from('reviews_with_votes_public')
      .select('*')
      .eq('address_osm_id', osmId)
      .order('created_at', { ascending: false });

    if (error) {
      throw handleSupabaseError(error);
    }

    return data;
  }

  async getById({ reviewId }: GetReviewByIdInput): Promise<GetReviewByIdOutput> {
    const { data, error } = await this.supabase
      .from('reviews_with_votes_public')
      .select('*,review_rooms:review_rooms(*),real_estates:real_estates_with_votes(*)')
      .eq('id', reviewId)
      .single();

    if (error) return null;
    return data as GetReviewByIdOutput;
  }

  async getByUserId(_: GetReviewsByUserIdInput): Promise<GetReviewsByUserIdOutput> {
    const { data, error } = await this.supabase.rpc('get_reviews_by_current_user');

    if (error) {
      throw handleSupabaseError(error);
    }

    return data;
  }

  async getByRealEstateId({
    realEstateId,
  }: GetReviewsByRealEstateIdInput): Promise<GetReviewsByRealEstateIdOutput> {
    const { data, error } = await this.supabase
      .from('reviews_with_votes_public')
      .select('*')
      .eq('real_estate_id', realEstateId)
      .order('created_at', { ascending: false });

    if (error) {
      throw handleSupabaseError(error);
    }

    return data || [];
  }

  async getUserVote({ reviewId }: GetUserReviewVoteInput): Promise<GetUserReviewVoteOutput> {
    const { data, error } = await this.supabase.rpc('get_user_review_vote', {
      p_review_id: reviewId,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return data as GetUserReviewVoteOutput;
  }

  async getUserFavorites({
    limit: _limit = 10,
    offset: _offset = 0,
  }: GetUserFavoriteReviewsInput): Promise<GetUserFavoriteReviewsOutput> {
    const { data, error } = await this.supabase.rpc('get_favorite_reviews_by_current_user');

    if (error) {
      throw handleSupabaseError(error);
    }

    return data ?? [];
  }

  async isFavorite({ reviewId }: IsReviewFavoriteInput): Promise<IsReviewFavoriteOutput> {
    const { data, error } = await this.supabase.rpc('is_review_favorite', {
      p_review_id: reviewId,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return data;
  }

  async checkUserReviewForAddress({
    osmId,
  }: CheckUserReviewForAddressInput): Promise<CheckUserReviewForAddressOutput> {
    const { data, error } = await this.supabase.rpc('check_user_review_for_address', {
      p_osm_id: osmId,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return data ? { id: data } : null;
  }

  async hasUserReportedReview({
    reviewId,
  }: HasUserReportedReviewInput): Promise<HasUserReportedReviewOutput> {
    const { data, error } = await this.supabase.rpc('has_user_reported_review', {
      p_review_id: reviewId,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return data;
  }
}
