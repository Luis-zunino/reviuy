import { ZodError } from 'zod';
import { PostgrestError } from '@supabase/supabase-js';
import { AppError, ErrorCodes, ErrorMessages, ErrorStatusCodes } from './types';

/**
 * Mapeo detallado de constraints de Supabase a mensajes amigables
 */
const SUPABASE_CONSTRAINT_MAP: Record<string, { message: string; code?: string }> = {
  // REAL ESTATES
  real_estates_name_key: {
    message: 'Ya existe una inmobiliaria con ese nombre.',
    code: 'real_estate_name',
  },
  unique_real_estates_name: {
    message: 'Ya existe una inmobiliaria con ese nombre.',
    code: 'real_estate_name',
  },

  // REVIEWS
  idx_reviews_user_address_osm_unique: {
    message: 'Ya dejaste una reseña para esta dirección.',
    code: 'address_osm_id',
  },

  // REAL ESTATE REVIEWS
  idx_real_estate_reviews_user_re_unique: {
    message: 'Ya dejaste una reseña para esta inmobiliaria.',
  },

  // VOTES
  review_votes_review_id_user_id_key: {
    message: 'Ya votaste esta reseña.',
  },
  real_estate_review_votes_real_estate_review_id_user_id_key: {
    message: 'Ya votaste esta reseña de inmobiliaria.',
  },
  real_estate_votes_real_estate_id_user_id_key: {
    message: 'Ya votaste esta inmobiliaria.',
  },

  // REPORTS
  review_reports_review_id_reported_by_user_id_key: {
    message: 'Ya reportaste esta reseña.',
  },
  real_estate_review_reports_real_estate_review_id_reported_by_user_id_key: {
    message: 'Ya reportaste esta reseña de inmobiliaria.',
  },
  real_estate_reports_real_estate_id_reported_by_user_id_key: {
    message: 'Ya reportaste esta inmobiliaria.',
  },

  // FAVORITES
  real_estate_favorites_real_estate_id_user_id_key: {
    message: 'Esta inmobiliaria ya está en tus favoritos.',
  },
  review_favorites_review_id_user_id_key: {
    message: 'Esta reseña ya está en tus favoritos.',
  },
};

/**
 * Factory para crear errores de aplicación con mensaje y código automático
 *
 * @example
 * ```typescript
 * throw createError('UNAUTHORIZED');
 * throw createError('NOT_FOUND', 'Reseña no encontrada');
 * ```
 */
export function createError(code: keyof typeof ErrorCodes, customMessage?: string): AppError {
  const errorCode = ErrorCodes[code];
  const message = customMessage || ErrorMessages[errorCode];
  const statusCode = ErrorStatusCodes[errorCode];
  return new AppError(errorCode, message, statusCode);
}

/**
 * Verifica si un error es una instancia de AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Convierte errores de Zod en AppError
 *
 * @example
 * ```typescript
 * try {
 *   schema.parse(data);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     throw handleZodError(error);
 *   }
 * }
 * ```
 */
export function handleZodError(error: ZodError): AppError {
  const firstError = error.issues[0];
  const field = firstError.path.join('.');
  const message = `${field}: ${firstError.message}`;

  return new AppError(ErrorCodes.VALIDATION_ERROR, message, 400);
}

/**
 * Convierte errores de Supabase en AppError con mensajes amigables
 *
 * @example
 * ```typescript
 * const { error } = await supabase.from('reviews').insert(data);
 * if (error) {
 *   throw handleSupabaseError(error);
 * }
 * ```
 */
export function handleSupabaseError(error: PostgrestError): AppError {
  // UNIQUE VIOLATION (23505)
  if (error.code === '23505') {
    // Buscar constraint específico en el mensaje
    const constraint = Object.keys(SUPABASE_CONSTRAINT_MAP).find((key) =>
      error.message.includes(key)
    );

    if (constraint) {
      const { message, code } = SUPABASE_CONSTRAINT_MAP[constraint];
      const appError = new AppError(ErrorCodes.ALREADY_EXISTS, message, 409) as AppError & {
        field?: string;
      };
      // Agregar código de campo opcional
      if (code) {
        appError.field = code;
      }
      return appError;
    }

    // Mensaje genérico si no se encuentra el constraint
    return new AppError(ErrorCodes.ALREADY_EXISTS, 'El valor ingresado ya existe.', 409);
  }

  // FOREIGN KEY VIOLATION (23503)
  if (error.code === '23503') {
    return new AppError(
      ErrorCodes.INVALID_INPUT,
      'El recurso relacionado no existe o fue eliminado.',
      400
    );
  }

  // NOT NULL VIOLATION (23502)
  if (error.code === '23502') {
    return new AppError(ErrorCodes.VALIDATION_ERROR, 'Falta un campo requerido.', 400);
  }

  // CHECK VIOLATION (23514)
  if (error.code === '23514') {
    return new AppError(
      ErrorCodes.VALIDATION_ERROR,
      'El valor no cumple con las restricciones.',
      400
    );
  }

  // Error genérico de base de datos
  return new AppError(ErrorCodes.DATABASE_ERROR, error.message, 500);
}
