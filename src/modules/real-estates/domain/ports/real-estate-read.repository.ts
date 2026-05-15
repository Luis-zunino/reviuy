import type {
  GetRealEstateByIdInput,
  GetRealEstateByIdOutput,
  GetAllRealEstateReviewsInput,
  GetAllRealEstateReviewsOutput,
  GetRealEstateReviewByIdInput,
  GetRealEstateReviewByIdOutput,
  GetRealEstateReviewByUserIdInput,
  GetRealEstateReviewByUserIdOutput,
  GetUserRealEstateVoteInput,
  GetUserRealEstateVoteOutput,
  SearchRealEstatesInput,
  SearchRealEstatesOutput,
  GetAllRealEstatesPaginatedInput,
  GetAllRealEstatesPaginatedOutput,
  GetUserFavoriteRealEstatesOutput,
  IsRealEstateFavoriteInput,
  HasUserReportedRealEstateInput,
  HasUserReportedRealEstateReviewInput,
} from '../contracts/real-estate.types';

export interface RealEstateReadRepository {
  getById(input: GetRealEstateByIdInput): Promise<GetRealEstateByIdOutput>;
  getAllReviews(input: GetAllRealEstateReviewsInput): Promise<GetAllRealEstateReviewsOutput>;
  getReviewById(input: GetRealEstateReviewByIdInput): Promise<GetRealEstateReviewByIdOutput>;
  getReviewByUserId(
    input: GetRealEstateReviewByUserIdInput
  ): Promise<GetRealEstateReviewByUserIdOutput>;
  getUserVote(input: GetUserRealEstateVoteInput): Promise<GetUserRealEstateVoteOutput>;
  search(input: SearchRealEstatesInput): Promise<SearchRealEstatesOutput>;
  getRealEstatesWithVotesPaginated(
    input: GetAllRealEstatesPaginatedInput
  ): Promise<GetAllRealEstatesPaginatedOutput>;
  getUserFavorites(): Promise<GetUserFavoriteRealEstatesOutput>;
  isFavorite(input: IsRealEstateFavoriteInput): Promise<boolean>;
  hasUserReported(input: HasUserReportedRealEstateInput): Promise<boolean>;
  hasUserReportedReview(input: HasUserReportedRealEstateReviewInput): Promise<boolean>;
}
