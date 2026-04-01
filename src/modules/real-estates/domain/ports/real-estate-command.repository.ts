import type {
  CreateRealEstateInput,
  RealEstate,
  VoteRealEstateInput,
  VoteRealEstateOutput,
  ToggleFavoriteRealEstateInput,
  ToggleFavoriteRealEstateOutput,
  CreateRealEstateReviewInput,
  CreateRealEstateReviewOutput,
  UpdateRealEstateReviewInput,
  UpdateRealEstateReviewOutput,
  DeleteRealEstateReviewInput,
  DeleteRealEstateReviewOutput,
  VoteRealEstateReviewInput,
  VoteRealEstateReviewOutput,
} from '../contracts/real-estate.types';

export interface RealEstateCommandRepository {
  create(input: CreateRealEstateInput): Promise<RealEstate>;
  vote(input: VoteRealEstateInput): Promise<VoteRealEstateOutput>;
  toggleFavorite(input: ToggleFavoriteRealEstateInput): Promise<ToggleFavoriteRealEstateOutput>;
  createReview(input: CreateRealEstateReviewInput): Promise<CreateRealEstateReviewOutput>;
  updateReview(input: UpdateRealEstateReviewInput): Promise<UpdateRealEstateReviewOutput>;
  deleteReview(input: DeleteRealEstateReviewInput): Promise<DeleteRealEstateReviewOutput>;
  voteReview(input: VoteRealEstateReviewInput): Promise<VoteRealEstateReviewOutput>;
}
