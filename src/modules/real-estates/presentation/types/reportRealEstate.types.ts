export interface ReportRealEstateRequest {
  real_estate_id: string;
  reason: string;
  description?: string;
  user_id?: string;
}

export interface ReportRealEstateResponse {
  success: boolean;
  message?: string;
  error?: string;
}
