export interface CreateRealEstateReviewData {
  real_estate_id: string;
  title: string;
  comment?: string;
  description?: string;
  rating: number;
}

export interface UpdateRealEstateReviewData {
  title?: string;
  comment?: string;
  rating?: number;
}
