import type {
  UploadReviewImageInput,
  UploadReviewImageResult,
  DeleteReviewImageInput,
  DeleteReviewImageResult,
  GetReviewImagesInput,
  GetReviewImagesOutput,
} from '../contracts/property-review.types';

export interface ReviewImageRepository {
  upload(input: UploadReviewImageInput): Promise<UploadReviewImageResult>;
  delete(input: DeleteReviewImageInput): Promise<DeleteReviewImageResult>;
  getByReviewId(input: GetReviewImagesInput): Promise<GetReviewImagesOutput>;
}
