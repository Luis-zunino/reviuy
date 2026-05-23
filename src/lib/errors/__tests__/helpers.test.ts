import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { AppError } from '../types';
import { createError, isAppError, handleZodError, handleSupabaseError } from '../helpers';

describe('createError', () => {
  it('creates error with default message for the code', () => {
    const error = createError('NOT_FOUND');
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('El recurso solicitado no existe');
    expect(error.statusCode).toBe(404);
  });

  it('creates error with custom message', () => {
    const error = createError('UNAUTHORIZED', 'Debes iniciar sesión');
    expect(error.code).toBe('UNAUTHORIZED');
    expect(error.message).toBe('Debes iniciar sesión');
    expect(error.statusCode).toBe(401);
  });

  it('creates rate limit error', () => {
    const error = createError('RATE_LIMIT');
    expect(error.code).toBe('RATE_LIMIT');
    expect(error.statusCode).toBe(429);
  });
});

describe('isAppError', () => {
  it('returns true for AppError instance', () => {
    expect(isAppError(new AppError('TEST', 'msg', 400))).toBe(true);
  });

  it('returns false for regular Error', () => {
    expect(isAppError(new Error('msg'))).toBe(false);
  });

  it('returns false for null', () => {
    expect(isAppError(null)).toBe(false);
  });

  it('returns false for plain objects', () => {
    expect(isAppError({ code: 'TEST', message: 'msg' })).toBe(false);
  });
});

describe('handleZodError', () => {
  it('creates AppError from ZodError with field path and message', () => {
    const zodError = new ZodError([
      {
        path: ['email'],
        message: 'Invalid email',
        code: 'invalid_format' as const,
        format: 'email',
      },
    ]);

    const result = handleZodError(zodError);

    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe('VALIDATION_ERROR');
    expect(result.message).toBe('email: Invalid email');
    expect(result.statusCode).toBe(400);
  });
});

describe('handleSupabaseError', () => {
  const makePostgrestError = (code: string, message: string) =>
    ({ code, message, details: '', hint: '' }) as any;

  it('handles unique violation (23505) with known constraint', () => {
    const error = makePostgrestError('23505', 'real_estates_name_key');

    const result = handleSupabaseError(error);

    expect(result.code).toBe('ALREADY_EXISTS');
    expect(result.statusCode).toBe(409);
    expect(result.message).toBe('Ya existe una inmobiliaria con ese nombre.');
  });

  it('appends optional field code for known constraint', () => {
    const error = makePostgrestError('23505', 'real_estates_name_key');
    const result = handleSupabaseError(error) as AppError & { field?: string };

    expect(result.field).toBe('real_estate_name');
  });

  it('handles unique violation (23505) with generic message for unknown constraint', () => {
    const error = makePostgrestError('23505', 'some_unknown_constraint');

    const result = handleSupabaseError(error);

    expect(result.code).toBe('ALREADY_EXISTS');
    expect(result.statusCode).toBe(409);
    expect(result.message).toBe('El valor ingresado ya existe.');
  });

  it('handles foreign key violation (23503)', () => {
    const error = makePostgrestError('23503', 'violates foreign key constraint');

    const result = handleSupabaseError(error);

    expect(result.code).toBe('INVALID_INPUT');
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe('El recurso relacionado no existe o fue eliminado.');
  });

  it('handles not null violation (23502)', () => {
    const error = makePostgrestError('23502', 'null value in column');

    const result = handleSupabaseError(error);

    expect(result.code).toBe('VALIDATION_ERROR');
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe('Falta un campo requerido.');
  });

  it('handles check violation (23514)', () => {
    const error = makePostgrestError('23514', 'new row violates check constraint');

    const result = handleSupabaseError(error);

    expect(result.code).toBe('VALIDATION_ERROR');
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe('El valor no cumple con las restricciones.');
  });

  it('handles unknown error code as generic database error', () => {
    const error = makePostgrestError('PGRST00', 'unknown database error');

    const result = handleSupabaseError(error);

    expect(result.code).toBe('DATABASE_ERROR');
    expect(result.statusCode).toBe(500);
    expect(result.message).toBe('unknown database error');
  });
});
