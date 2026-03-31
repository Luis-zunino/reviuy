import type {
  RealEstate,
  RealEstateReview,
  RealEstateReviewWithVotes,
  RealEstateReviewWithVotesPublic,
  RealEstateWitheVotes,
  VoteType,
} from '@/types';

export type RealEstateReviewSummary = Pick<
  RealEstateReview,
  'id' | 'real_estate_id' | 'title' | 'description' | 'rating' | 'created_at' | 'updated_at'
>;

export interface CreateRealEstateInput {
  real_estate_name: string;
}

export type CreateRealEstateOutput = RealEstate;

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
