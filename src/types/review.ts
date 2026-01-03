import { RealEstate } from './realEstate';
import { Database } from './supabase';

// Tipos base (como los tienes)
export type Review = Database['public']['Tables']['reviews']['Row'];
export type ReviewRoom = Database['public']['Tables']['review_rooms']['Row'];

// Tipo para crear (insert)
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type ReviewRoomInsert = Database['public']['Tables']['review_rooms']['Insert'];

// Tipo para actualizar (update)
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];
export type ReviewRoomUpdate = Database['public']['Tables']['review_rooms']['Update'];

// Tipo con relaciones
export type ReviewWithRoomsAndRealEstates = ReviewUpdate & {
  review_rooms: ReviewRoom[];
  real_estates?: RealEstate;
};

export type ReviewWithRelations = Review & {
  review_rooms: ReviewRoomUpdate[];
  real_estates: RealEstate | null;
};

// Tipo para formulario
export type ReviewFormData = {
  title: string;
  description: string;
  rating: number;
  property_type?: string | null;
  address_text?: string | null;
  address_osm_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  zone_rating?: number | null;
  winter_comfort_rating?: number | null;
  summer_comfort_rating?: number | null;
  winter_comfort?: string | null;
  summer_comfort?: string | null;
  humidity?: string | null;
  humidity_level?: string | null;
  image_url?: string | null;
  real_estate_id?: string | null;
  real_estate_experience?: string | null;
  review_rooms: {
    id?: string;
    room_type: string;
    area_m2: number;
  }[];
};
