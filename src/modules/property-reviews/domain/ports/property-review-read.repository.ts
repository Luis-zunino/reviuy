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
} from '../contracts/property-review.types';

export interface PropertyReviewReadRepository {
  getByAddress(input: GetReviewsByAddressInput): Promise<PropertyReviewAddressReadModel[]>;
  getById(input: GetReviewByIdInput): Promise<GetReviewByIdOutput>;
  getByUserId(input: GetReviewsByUserIdInput): Promise<GetReviewsByUserIdOutput>;
  getByRealEstateId(input: GetReviewsByRealEstateIdInput): Promise<GetReviewsByRealEstateIdOutput>;
  getUserVote(input: GetUserReviewVoteInput): Promise<GetUserReviewVoteOutput>;
  getUserFavorites(input: GetUserFavoriteReviewsInput): Promise<GetUserFavoriteReviewsOutput>;
  isFavorite(input: IsReviewFavoriteInput): Promise<IsReviewFavoriteOutput>;
  checkUserReviewForAddress(
    input: CheckUserReviewForAddressInput
  ): Promise<CheckUserReviewForAddressOutput>;
  hasUserReportedReview(input: HasUserReportedReviewInput): Promise<HasUserReportedReviewOutput>;
}
