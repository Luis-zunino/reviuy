import type {
  CreatePropertyReviewInput,
  CreatePropertyReviewResult,
  UpdatePropertyReviewInput,
  UpdatePropertyReviewResult,
  DeletePropertyReviewInput,
  DeletePropertyReviewResult,
  VotePropertyReviewInput,
  VotePropertyReviewResult,
  ToggleFavoritePropertyReviewInput,
  ToggleFavoritePropertyReviewResult,
} from '../contracts/property-review.types';

export interface PropertyReviewCommandRepository {
  create(input: CreatePropertyReviewInput): Promise<CreatePropertyReviewResult>;
  update(input: UpdatePropertyReviewInput): Promise<UpdatePropertyReviewResult>;
  delete(input: DeletePropertyReviewInput): Promise<DeletePropertyReviewResult>;
  vote(input: VotePropertyReviewInput): Promise<VotePropertyReviewResult>;
  toggleFavorite(
    input: ToggleFavoritePropertyReviewInput
  ): Promise<ToggleFavoritePropertyReviewResult>;
}
