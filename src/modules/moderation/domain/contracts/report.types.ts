export interface ReportReviewInput {
  review_id: string;
  reason: string;
  description?: string;
}

export interface ReportRealEstateInput {
  real_estate_id: string;
  reason: string;
  description?: string;
}

export interface ReportRealEstateReviewInput {
  review_id: string;
  reason: string;
  description?: string;
}

export interface ReportActionResponse {
  success: boolean;
  message: string;
  error?: string;
}
