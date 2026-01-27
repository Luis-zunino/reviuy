import { PostgrestError } from '@supabase/supabase-js';

export type FriendlyError = {
  name: string;
  message: string;
  code?: string;
};

/**
 * Mapeo por constraint / índice único
 */
export const UNIQUE_CONSTRAINT_MAP: Record<string, FriendlyError> = {
  // ============================
  // REAL ESTATES
  // ============================
  real_estates_name_key: {
    name: 'Inmobiliaria duplicada',
    message: 'Ya existe una inmobiliaria con ese nombre.',
    code: 'real_estate_name',
  },

  unique_real_estates_name: {
    name: 'Inmobiliaria duplicada',
    message: 'Ya existe una inmobiliaria con ese nombre.',
    code: 'real_estate_name',
  },

  // ============================
  // REVIEWS
  // ============================
  idx_reviews_user_address_osm_unique: {
    name: 'Reseña duplicada',
    message: 'Ya dejaste una reseña para esta dirección.',
    code: 'address_osm_id',
  },

  // ============================
  // REAL ESTATE REVIEWS
  // ============================
  idx_real_estate_reviews_user_re_unique: {
    name: 'Reseña duplicada',
    message: 'Ya dejaste una reseña para esta inmobiliaria.',
  },

  review_votes_review_id_user_id_key: {
    name: 'Voto duplicado',
    message: 'Ya votaste esta reseña.',
  },
  review_reports_review_id_reported_by_user_id_key: {
    name: 'Reporte duplicado',
    message: 'Ya reportaste esta reseña.',
  },
  real_estate_review_votes_real_estate_review_id_user_id_key: {
    name: 'Voto duplicado',
    message: 'Ya votaste esta reseña de inmobiliaria.',
  },
  real_estate_review_reports_real_estate_review_id_reported_by_user_id_key: {
    name: 'Reporte duplicado',
    message: 'Ya reportaste esta reseña de inmobiliaria.',
  },

  real_estate_reports_real_estate_id_reported_by_user_id_key: {
    name: 'Reporte duplicado',
    message: 'Ya reportaste esta inmobiliaria.',
  },
  real_estate_votes_real_estate_id_user_id_key: {
    name: 'Voto duplicado',
    message: 'Ya votaste esta inmobiliaria.',
  },
  real_estate_favorites_real_estate_id_user_id_key: {
    name: 'Ya está en favoritos',
    message: 'Esta inmobiliaria ya está en tus favoritos.',
  },
  review_favorites_review_id_user_id_key: {
    name: 'Ya está en favoritos',
    message: 'Esta reseña ya está en tus favoritos.',
  },
};

export const parseSupabaseError = (error: PostgrestError): FriendlyError => {
  // UNIQUE VIOLATION
  if (error.code === '23505') {
    const constraint = Object.keys(UNIQUE_CONSTRAINT_MAP).find((key) =>
      error.message.includes(key)
    );

    if (constraint) {
      return UNIQUE_CONSTRAINT_MAP[constraint];
    }

    return {
      name: 'Valor duplicado',
      message: 'El valor ingresado ya existe.',
    };
  }

  // FK violation
  if (error.code === '23503') {
    return {
      name: 'Referencia inválida',
      message: 'El recurso relacionado no existe o fue eliminado.',
    };
  }

  // Fallback
  return {
    name: 'Error inesperado',
    message: `Ocurrió un error al procesar la solicitud. ${error.message}`,
  };
};
