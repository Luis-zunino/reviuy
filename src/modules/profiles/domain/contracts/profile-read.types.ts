import { ReviewWithVotesPublic } from '@/modules/property-reviews';
import { type RealEstateWithVotesPublic } from '@/modules/real-estates';

export type GetCurrentUserReviewsOutput = ReviewWithVotesPublic[] | null;

export type GetCurrentUserFavoriteReviewsOutput = ReviewWithVotesPublic[];

export type GetCurrentUserFavoriteRealEstatesOutput = RealEstateWithVotesPublic[];

export interface GetCurrentUserSummaryOutput {
  reviews: GetCurrentUserReviewsOutput;
  favoriteReviews: GetCurrentUserFavoriteReviewsOutput;
  favoriteRealEstates: GetCurrentUserFavoriteRealEstatesOutput;
  stats: {
    reviewsCount: number;
    favoriteReviewsCount: number;
    favoriteRealEstatesCount: number;
  };
}
