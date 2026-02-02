/**
 * @fileoverview Tipos de error personalizados para la aplicación
 * @module lib/errors/types
 */

/**
 * Clase base para errores de aplicación con código y status HTTP
 *
 * @example
 * ```typescript
 * throw new AppError(
 *   ErrorCodes.UNAUTHORIZED,
 *   'Debes iniciar sesión',
 *   401
 * );
 * ```
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
    // Mantiene el stack trace correcto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * Convierte el error a un objeto serializable
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

/**
 * Códigos de error estandarizados de la aplicación
 */
export const ErrorCodes = {
  // Autenticación y Autorización
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // Rate Limiting
  RATE_LIMIT: 'RATE_LIMIT',

  // Recursos
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',

  // Validación
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Base de datos
  DATABASE_ERROR: 'DATABASE_ERROR',

  // Genéricos
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * Tipo para los códigos de error
 */
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Mensajes de error por defecto para cada código
 */
export const ErrorMessages: Record<ErrorCode, string> = {
  UNAUTHORIZED: 'Debes iniciar sesión para realizar esta acción',
  FORBIDDEN: 'No tienes permisos para realizar esta acción',
  RATE_LIMIT: 'Has excedido el límite de solicitudes. Intenta de nuevo más tarde',
  NOT_FOUND: 'El recurso solicitado no existe',
  ALREADY_EXISTS: 'El recurso ya existe',
  VALIDATION_ERROR: 'Los datos proporcionados no son válidos',
  INVALID_INPUT: 'Los datos de entrada son inválidos',
  DATABASE_ERROR: 'Error al procesar la solicitud en la base de datos',
  INTERNAL_ERROR: 'Error interno del servidor',
  UNKNOWN_ERROR: 'Ha ocurrido un error inesperado',
};

/**
 * Mapeo de códigos de error a códigos HTTP
 */
export const ErrorStatusCodes: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  RATE_LIMIT: 429,
  NOT_FOUND: 404,
  ALREADY_EXISTS: 409,
  VALIDATION_ERROR: 400,
  INVALID_INPUT: 400,
  DATABASE_ERROR: 500,
  INTERNAL_ERROR: 500,
  UNKNOWN_ERROR: 500,
};
