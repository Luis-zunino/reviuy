export interface DeleteRealEstateReviewParams {
  reviewId?: string;
  user_id?: string;
}

export interface DeleteRealEstateReviewResponse {
  success: boolean;
  message: string;
  error?: string;
}
