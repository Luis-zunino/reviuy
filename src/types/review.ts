import { RealEstate, RealEstateWitheVotes } from './realEstate';
import { Database } from './supabase';

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
