import type {
  GetCurrentUserFavoriteRealEstatesOutput,
  GetCurrentUserFavoriteReviewsOutput,
  GetCurrentUserReviewsOutput,
} from '../contracts/profile-read.types';

export interface ProfileReadRepository {
  getCurrentUserReviews(): Promise<GetCurrentUserReviewsOutput>;
  getCurrentUserFavoriteReviews(): Promise<GetCurrentUserFavoriteReviewsOutput>;
  getCurrentUserFavoriteRealEstates(): Promise<GetCurrentUserFavoriteRealEstatesOutput>;
}
