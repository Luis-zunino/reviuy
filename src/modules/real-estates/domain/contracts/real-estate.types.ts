import type { Database, VoteType } from '@/types';

export type RealEstateReviewInsert = Database['public']['Tables']['real_estate_reviews']['Insert'];
export type RealEstate = Database['public']['Tables']['real_estates']['Row'];
export type RealEstateReview = Database['public']['Tables']['real_estate_reviews']['Row'];
export type RealEstateWitheVotes = Database['public']['Views']['real_estates_with_votes']['Row'];
export type RealEstateReviewWithVotes =
  Database['public']['Views']['real_estate_reviews_with_votes']['Row'];
/**
 * Vista pública de reseñas de inmobiliarias con estadísticas de votos, sin user_id.
 * Usar para mostrar reseñas en listados públicos con likes/dislikes.
 */
export type RealEstateReviewWithVotesPublic =
  Database['public']['Views']['real_estate_reviews_with_votes_public']['Row'];

export type RealEstateReviewSummary = Pick<
  RealEstateReview,
  'id' | 'real_estate_id' | 'title' | 'description' | 'rating' | 'created_at' | 'updated_at'
>;

export interface CreateRealEstateInput {
  real_estate_name: string;
}

export interface VoteRealEstateInput {
  realEstateId: string;
  voteType: VoteType;
}

export type VoteRealEstateOutput = Record<string, unknown>;

export interface ToggleFavoriteRealEstateInput {
  realEstateId: string;
}

export interface ToggleFavoriteRealEstateOutput {
  success?: boolean | null;
  is_favorite?: boolean | null;
  message?: string | null;
  error?: string | null;
  [key: string]: unknown;
}

export interface CreateRealEstateReviewInput {
  title: string;
  description: string;
  rating: number;
  real_estate_id: string;
}

export interface CreateRealEstateReviewOutput {
  success: boolean;
  message: string;
  error?: string;
  data?: RealEstateReviewSummary;
}

export interface UpdateRealEstateReviewInput {
  reviewId: string;
  title?: string;
  description?: string;
  rating?: number;
}

export interface UpdateRealEstateReviewOutput {
  success: boolean;
  message: string;
  error?: string;
  data?: RealEstateReview;
}

export interface DeleteRealEstateReviewInput {
  reviewId: string;
}

export interface DeleteRealEstateReviewOutput {
  success: boolean;
  message: string;
  error?: string;
}

export interface VoteRealEstateReviewInput {
  reviewId: string;
  voteType: VoteType;
}

export type VoteRealEstateReviewOutput = Record<string, unknown>;

export interface GetRealEstateByIdInput {
  id: string;
}

export type GetRealEstateByIdOutput = RealEstateWitheVotes | null;

export interface GetAllRealEstateReviewsInput {
  id: string;
  limit?: number;
}

export type GetAllRealEstateReviewsOutput = RealEstateReviewWithVotesPublic[];

export interface GetRealEstateReviewByIdInput {
  reviewId: string;
}

export type GetRealEstateReviewByIdOutput = RealEstateReviewWithVotesPublic | null;

export interface GetRealEstateReviewByUserIdInput {
  realEstateId: string;
}

export type GetRealEstateReviewByUserIdOutput = RealEstateReviewWithVotes | null;

export interface GetUserRealEstateVoteInput {
  realEstateId: string;
}

export type GetUserRealEstateVoteOutput = VoteType | null;

export interface SearchRealEstatesInput {
  query: string;
  limit?: number;
}

export type SearchRealEstatesOutput = RealEstateWitheVotes[];

export interface GetAllRealEstatesPaginatedInput {
  limit?: number;
  offset?: number;
  search?: string | null;
  rating?: number | null;
}

export interface GetAllRealEstatesPaginatedOutput {
  data: RealEstateWitheVotes[];
  nextOffset: number | null;
}

export type GetUserFavoriteRealEstatesOutput = RealEstateWitheVotes[];

export interface IsRealEstateFavoriteInput {
  realEstateId: string;
}

export interface HasUserReportedRealEstateInput {
  realEstateId?: string;
}

export interface HasUserReportedRealEstateReviewInput {
  reviewId: string;
}
