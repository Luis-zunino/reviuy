import { describe, expect, it } from 'vitest';
import { AppError, ErrorCodes, ErrorMessages, ErrorStatusCodes } from '../types';

describe('AppError', () => {
  it('creates error with code, message and statusCode', () => {
    const error = new AppError('NOT_FOUND', 'Recurso no encontrado', 404);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AppError');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('Recurso no encontrado');
    expect(error.statusCode).toBe(404);
  });

  it('defaults statusCode to 400', () => {
    const error = new AppError('VALIDATION_ERROR', 'Datos inválidos');
    expect(error.statusCode).toBe(400);
  });

  it('serializes to JSON correctly', () => {
    const error = new AppError('FORBIDDEN', 'Acceso denegado', 403);

    expect(error.toJSON()).toEqual({
      name: 'AppError',
      code: 'FORBIDDEN',
      message: 'Acceso denegado',
      statusCode: 403,
    });
  });

  it('has stack trace', () => {
    const error = new AppError('INTERNAL_ERROR', 'Error interno');
    expect(error.stack).toBeDefined();
  });
});

describe('ErrorCodes', () => {
  it('contains all expected error codes', () => {
    expect(ErrorCodes).toMatchObject({
      UNAUTHORIZED: 'UNAUTHORIZED',
      FORBIDDEN: 'FORBIDDEN',
      RATE_LIMIT: 'RATE_LIMIT',
      NOT_FOUND: 'NOT_FOUND',
      ALREADY_EXISTS: 'ALREADY_EXISTS',
      VALIDATION_ERROR: 'VALIDATION_ERROR',
      INVALID_INPUT: 'INVALID_INPUT',
      DATABASE_ERROR: 'DATABASE_ERROR',
      INTERNAL_ERROR: 'INTERNAL_ERROR',
      UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    });
  });
});

describe('ErrorMessages', () => {
  it('has messages for all error codes', () => {
    const allCodes = Object.values(ErrorCodes);
    allCodes.forEach((code) => {
      expect(ErrorMessages[code]).toBeDefined();
      expect(typeof ErrorMessages[code]).toBe('string');
      expect(ErrorMessages[code].length).toBeGreaterThan(0);
    });
  });
});

describe('ErrorStatusCodes', () => {
  it('maps UNAUTHORIZED to 401', () => {
    expect(ErrorStatusCodes[ErrorCodes.UNAUTHORIZED]).toBe(401);
  });

  it('maps FORBIDDEN to 403', () => {
    expect(ErrorStatusCodes[ErrorCodes.FORBIDDEN]).toBe(403);
  });

  it('maps RATE_LIMIT to 429', () => {
    expect(ErrorStatusCodes[ErrorCodes.RATE_LIMIT]).toBe(429);
  });

  it('maps NOT_FOUND to 404', () => {
    expect(ErrorStatusCodes[ErrorCodes.NOT_FOUND]).toBe(404);
  });

  it('maps ALREADY_EXISTS to 409', () => {
    expect(ErrorStatusCodes[ErrorCodes.ALREADY_EXISTS]).toBe(409);
  });

  it('maps VALIDATION_ERROR and INVALID_INPUT to 400', () => {
    expect(ErrorStatusCodes[ErrorCodes.VALIDATION_ERROR]).toBe(400);
    expect(ErrorStatusCodes[ErrorCodes.INVALID_INPUT]).toBe(400);
  });

  it('maps DATABASE_ERROR, INTERNAL_ERROR, UNKNOWN_ERROR to 500', () => {
    expect(ErrorStatusCodes[ErrorCodes.DATABASE_ERROR]).toBe(500);
    expect(ErrorStatusCodes[ErrorCodes.INTERNAL_ERROR]).toBe(500);
    expect(ErrorStatusCodes[ErrorCodes.UNKNOWN_ERROR]).toBe(500);
  });
});
