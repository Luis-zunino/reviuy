import type {
  Review,
  ReviewRoom,
  ReviewWithVotes,
  ReviewWithVotesPublic,
  ReviewPublicWithRelations,
  VoteType,
} from '@/types';

export interface PropertyReviewRoomDraft {
  room_type: string | null;
  area_m2: number | null;
}

export interface CreatePropertyReviewInput {
  title: string;
  description: string;
  rating: number;
  address_osm_id: string;
  address_text: string;
  latitude: number;
  longitude: number;
  real_estate_id?: string | null;
  property_type?: string | null;
  zone_rating?: number | null;
  winter_comfort?: string;
  summer_comfort?: string;
  humidity?: string;
  real_estate_experience?: string | null;
  apartment_number?: string | null;
  review_rooms?: PropertyReviewRoomDraft[];
}

export interface CreatePropertyReviewResult {
  success: boolean;
  message: string;
  error?: string;
  data?: Review & { review_rooms?: ReviewRoom[] };
}

export interface GetReviewsByAddressInput {
  osmId: string;
}

export type PropertyReviewAddressReadModel = ReviewWithVotesPublic;

export interface UpdatePropertyReviewInput {
  reviewId: string;
  title?: string;
  description?: string;
  rating?: number;
  property_type?: string | null;
  zone_rating?: number | null;
  winter_comfort?: string;
  summer_comfort?: string;
  humidity?: string;
  real_estate_experience?: string | null;
  apartment_number?: string | null;
  review_rooms?: PropertyReviewRoomDraft[];
}

export interface UpdatePropertyReviewResult {
  success: boolean;
  message: string;
  error?: string;
  data?: Review & { review_rooms?: ReviewRoom[] };
}

export interface DeletePropertyReviewInput {
  reviewId: string;
}

export interface DeletePropertyReviewResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface VotePropertyReviewInput {
  reviewId: string;
  voteType: VoteType;
}

export interface VotePropertyReviewResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface ToggleFavoritePropertyReviewInput {
  reviewId: string;
}

export interface ToggleFavoritePropertyReviewResult {
  success: boolean;
  message: string;
  error?: string;
  favorited?: boolean;
}

// ============================================================================
// QUERY TYPES
// ============================================================================

export interface GetReviewByIdInput {
  reviewId: string;
}

export type GetReviewByIdOutput = ReviewPublicWithRelations | null;

export interface GetReviewsByUserIdInput {
  userId?: string;
}

export type GetReviewsByUserIdOutput = ReviewWithVotes[] | null;

export interface GetReviewsByRealEstateIdInput {
  realEstateId: string;
}

export type GetReviewsByRealEstateIdOutput = ReviewWithVotesPublic[];

export interface GetUserReviewVoteInput {
  reviewId: string;
}

export interface UserReviewVote {
  vote_type: VoteType | null;
}

export type GetUserReviewVoteOutput = VoteType | null;

export interface GetUserFavoriteReviewsInput {
  limit?: number;
  offset?: number;
}

export type GetUserFavoriteReviewsOutput = ReviewWithVotes[];

export interface IsReviewFavoriteInput {
  reviewId: string;
}

export type IsReviewFavoriteOutput = boolean;

export interface CheckUserReviewForAddressInput {
  osmId: string;
}

export type CheckUserReviewForAddressOutput = { id: string } | null;

export interface HasUserReportedReviewInput {
  reviewId: string;
}

export type HasUserReportedReviewOutput = boolean;
