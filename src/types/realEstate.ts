import { Database } from './supabase';

export type RealEstate = Database['public']['Tables']['real_estates']['Row'];
export type RealEstateInsert = Database['public']['Tables']['real_estates']['Insert'];
export type RealEstateUpdate = Database['public']['Tables']['real_estates']['Update'];

export type RealEstateReview = Database['public']['Tables']['real_estate_reviews']['Row'];
export type RealEstateReviewInsert = Database['public']['Tables']['real_estate_reviews']['Insert'];
export type RealEstateReviewUpdate = Database['public']['Tables']['real_estate_reviews']['Update'];
