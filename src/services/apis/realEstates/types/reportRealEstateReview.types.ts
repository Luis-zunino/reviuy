export interface ReportRealEstateReviewRequest {
  review_id: string;
  reason: string;
  description: string;
  user_id?: string;
}

export interface ReportRealEstateReviewResponse {
  success: boolean;
  message?: string;
  error?: string;
}
