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
} from '../contracts/property-review.types';

export interface PropertyReviewReadRepository {
  getByAddress(input: GetReviewsByAddressInput): Promise<ReviewWithVotesPublic[]>;
  getById(input: GetReviewByIdInput): Promise<GetReviewByIdOutput>;
  getByUserId(): Promise<GetReviewsByUserIdOutput>;
  getByRealEstateId(input: GetReviewsByRealEstateIdInput): Promise<GetReviewsByRealEstateIdOutput>;
  getUserVote(input: GetUserReviewVoteInput): Promise<GetUserReviewVoteOutput>;
  getUserFavorites(): Promise<GetUserFavoriteReviewsOutput>;
  isFavorite(input: IsReviewFavoriteInput): Promise<boolean>;
  checkUserReviewForAddress(
    input: CheckUserReviewForAddressInput
  ): Promise<CheckUserReviewForAddressOutput>;
  hasUserReportedReview(input: HasUserReportedReviewInput): Promise<boolean>;
  searchByZone(input: GetReviewsByZoneInput): Promise<GetReviewsByZoneOutput>;
  searchNearby(input: GetReviewsNearbyInput): Promise<GetReviewsNearbyOutput>;
}
