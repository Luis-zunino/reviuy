export interface ToggleFavoriteRealEstateRequest {
  realEstateId: string;
}

export interface ToggleFavoriteRealEstateResponse {
  success: boolean;
  isFavorite?: boolean;
  message?: string;
  error?: string;
}
