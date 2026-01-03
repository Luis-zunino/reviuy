export interface ToggleFavoriteReviewRequest {
  reviewId: string;
}

export interface ToggleFavoriteReviewResponse {
  success: boolean;
  isFavorite?: boolean;
  message?: string;
  error?: string;
}
