export interface ToggleFavoriteRealEstateRequest {
  realEstateId: string;
}

export interface ToggleFavoriteRealEstateResponse {
  success: boolean | null;
  is_favorite: boolean | null;
  message: string | null;
  error: string | null;
}
