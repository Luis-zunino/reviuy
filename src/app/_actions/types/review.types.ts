export interface CreateReviewData {
  title: string;
  description: string;
  rating: number;
  address_osm_id: string;
  address_text: string;
  latitude: number;
  longitude: number;
  real_estate_id?: string | null;
  property_type?: string | null;
  zone_rating?: number | null;
  winter_comfort?: string;
  summer_comfort?: string;
  humidity?: string;
  real_estate_experience?: string | null;
  apartment_number?: string | null;
  review_rooms?: Array<{
    room_type: string | null;
    area_m2: number | null;
  }>;
  data?: CreateReviewData; // Para compatibilidad con useCreateReview
}

export interface UpdateReviewData {
  title?: string;
  description?: string;
  rating?: number;
  property_type?: string | null;
  address_text?: string;
  latitude?: number;
  longitude?: number;
  zone_rating?: number | null;
  winter_comfort?: string;
  summer_comfort?: string;
  humidity?: string;
  real_estate_experience?: string | null;
  apartment_number?: string | null;
  review_rooms?: Array<{
    id?: string;
    room_type: string | null;
    area_m2: number | null;
    review_id?: string;
    created_at?: string;
    updated_at?: string;
  }>;
}
