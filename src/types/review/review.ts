import { RealEstate, RealEstateWitheVotes } from '@/types/real-estate';
import { Database } from '@/types/supabase';

/* ============================================================================
 * Tipos base (filas de tablas / vistas)
 * ============================================================================
 */

// Tabla reviews
export type Review = Database['public']['Tables']['reviews']['Row'];

// Vista con votos agregados
export type ReviewWithVotes = Database['public']['Views']['reviews_with_votes']['Row'];

// Tabla review_rooms
export type ReviewRoom = Database['public']['Tables']['review_rooms']['Row'];

/* ============================================================================
 * Tipos para mutaciones (insert / update)
 * ============================================================================
 */

export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

export type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];

export type ReviewRoomInsert = Database['public']['Tables']['review_rooms']['Insert'];

export type ReviewRoomUpdate = Database['public']['Tables']['review_rooms']['Update'];

/* ============================================================================
 * Tipos con relaciones (SELECT)
 * ============================================================================
 */

// Review + rooms + real estate
export type ReviewWithRoomsAndRealEstates = Review & {
  review_rooms: ReviewRoom[];
  real_estates: RealEstate | null;
};

// Review (vista con votos) + rooms + real estate con votos
export type ReviewWithRelations = ReviewWithVotes & {
  review_rooms: ReviewRoom[];
  real_estates: RealEstateWitheVotes | null;
};

/* ============================================================================
 * Tipos auxiliares (opcionales, por claridad)
 * ============================================================================
 */

// Si en algún punto querés dejar explícito el rating nullable
export type ReviewWithNullableRating = Omit<Review, 'rating'> & {
  rating: number | null;
};

/* ============================================================================
 * Tipos para vistas públicas (sin user_id - protección de privacidad)
 * ============================================================================
 */

/**
 * Vista pública de reviews sin user_id para proteger anonimato.
 * Usar para queries públicos donde no se necesita exponer la identidad del usuario.
 *
 * @see supabase/migrations/050_secure_user_privacy.sql
 */
export type ReviewWithVotesPublic = Database['public']['Views']['reviews_with_votes_public']['Row'];

/**
 * Review pública con relaciones (rooms + real estate).
 * Versión segura de ReviewWithRelations.
 */
export type ReviewPublicWithRelations = ReviewWithVotesPublic & {
  review_rooms: ReviewRoom[];
  real_estates: RealEstateWitheVotes | null;
};
