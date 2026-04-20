import { handleSupabaseError } from '@/lib/errors';
import { supabaseClient } from '@/lib/supabase/client';
import type {
  GetReviewsByAddressInput,
  ReviewWithVotesPublic,
  GetReviewByIdInput,
  GetReviewByIdOutput,
  GetReviewsByUserIdOutput,
  GetReviewsByRealEstateIdInput,
  GetReviewsByRealEstateIdOutput,
  GetUserReviewVoteInput,
  GetUserReviewVoteOutput,
  GetUserFavoriteReviewsOutput,
  IsReviewFavoriteInput,
  CheckUserReviewForAddressInput,
  CheckUserReviewForAddressOutput,
  HasUserReportedReviewInput,
  GetReviewsByZoneInput,
  GetReviewsByZoneOutput,
  GetReviewsNearbyInput,
  GetReviewsNearbyOutput,
  PropertyReviewReadRepository,
} from '../../domain';
import { normalizeSearchText } from '@/utils';
type SupabaseBrowserClient = typeof supabaseClient;

export class SupabasePropertyReviewReadRepository implements PropertyReviewReadRepository {
  constructor(private readonly supabase: SupabaseBrowserClient) {}

  async getByAddress({ osmId }: GetReviewsByAddressInput): Promise<ReviewWithVotesPublic[]> {
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

  async getByUserId(): Promise<GetReviewsByUserIdOutput> {
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

  async getUserFavorites(): Promise<GetUserFavoriteReviewsOutput> {
    const { data, error } = await this.supabase.rpc('get_favorite_reviews_by_current_user');

    if (error) {
      throw handleSupabaseError(error);
    }

    return data ?? [];
  }

  async isFavorite({ reviewId }: IsReviewFavoriteInput): Promise<boolean> {
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

  async hasUserReportedReview({ reviewId }: HasUserReportedReviewInput): Promise<boolean> {
    const { data, error } = await this.supabase.rpc('has_user_reported_review', {
      p_review_id: reviewId,
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return data;
  }

  async searchByZone({
    query,
    limit = 20,
  }: GetReviewsByZoneInput): Promise<GetReviewsByZoneOutput> {
    const normalizedQuery = normalizeSearchText(query);
    const { data, error } = await this.supabase
      .from('reviews_with_votes_public')
      .select('*')
      .ilike('address_text', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw handleSupabaseError(error);
    }

    if (normalizedQuery.length === 0) {
      return data ?? [];
    }

    const accentInsensitiveResults = (data ?? []).filter((review) =>
      normalizeSearchText(review.address_text ?? '').includes(normalizedQuery)
    );

    if (accentInsensitiveResults.length > 0) {
      return accentInsensitiveResults;
    }

    const fallbackLimit = Math.max(limit * 5, 100);
    const { data: fallbackData, error: fallbackError } = await this.supabase
      .from('reviews_with_votes_public')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(fallbackLimit);

    if (fallbackError) {
      throw handleSupabaseError(fallbackError);
    }

    return (fallbackData ?? [])
      .filter((review) => normalizeSearchText(review.address_text ?? '').includes(normalizedQuery))
      .slice(0, limit);
  }

  async searchNearby({
    lat,
    lon,
    radiusDeg = 0.02,
    limit = 20,
  }: GetReviewsNearbyInput): Promise<GetReviewsNearbyOutput> {
    const { data, error } = await this.supabase
      .from('reviews_with_votes_public')
      .select('*')
      .gte('latitude', lat - radiusDeg)
      .lte('latitude', lat + radiusDeg)
      .gte('longitude', lon - radiusDeg)
      .lte('longitude', lon + radiusDeg)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw handleSupabaseError(error);
    }

    return data ?? [];
  }
}
