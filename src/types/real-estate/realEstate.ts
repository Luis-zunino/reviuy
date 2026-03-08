import { Database } from '@/types/supabase';

export type RealEstate = Database['public']['Tables']['real_estates']['Row'];
export type RealEstateInsert = Database['public']['Tables']['real_estates']['Insert'];
export type RealEstateUpdate = Database['public']['Tables']['real_estates']['Update'];

export type RealEstateReview = Database['public']['Tables']['real_estate_reviews']['Row'];
export type RealEstateReviewInsert = Database['public']['Tables']['real_estate_reviews']['Insert'];
export type RealEstateReviewUpdate = Database['public']['Tables']['real_estate_reviews']['Update'];

export type RealEstateWitheVotes = Database['public']['Views']['real_estates_with_votes']['Row'];
export type RealEstateReviewWithVotes =
  Database['public']['Views']['real_estate_reviews_with_votes']['Row'];

/* ============================================================================
 * Tipos para vistas públicas (sin user_id - protección de privacidad)
 * ============================================================================
 */

/**
 * Vista pública de reseñas de inmobiliarias con estadísticas de votos, sin user_id.
 * Usar para mostrar reseñas en listados públicos con likes/dislikes.
 *
 * @see supabase/migrations/050_secure_user_privacy.sql
 */
export type RealEstateReviewWithVotesPublic =
  Database['public']['Views']['real_estate_reviews_with_votes_public']['Row'];
