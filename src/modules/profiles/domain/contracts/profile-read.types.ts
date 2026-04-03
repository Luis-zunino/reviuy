import { ReviewWithVotes } from '@/modules/property-reviews';
import { type RealEstateWitheVotes } from '@/modules/real-estates';

export type GetCurrentUserReviewsOutput = ReviewWithVotes[] | null;

export type GetCurrentUserFavoriteReviewsOutput = ReviewWithVotes[];

export type GetCurrentUserFavoriteRealEstatesOutput = RealEstateWitheVotes[];

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
