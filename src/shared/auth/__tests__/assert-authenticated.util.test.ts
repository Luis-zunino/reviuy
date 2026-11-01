import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AppError } from '@/lib/errors';

describe('assertAuthenticated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns userId when getCurrentUserId resolves to a string', async () => {
    const { assertAuthenticated } = await import('../assert-authenticated.util');

    const getCurrentUserId = vi.fn().mockResolvedValue('user-123');

    const result = await assertAuthenticated(getCurrentUserId);

    expect(result).toBe('user-123');
  });

  it('throws UNAUTHORIZED when getCurrentUserId returns null', async () => {
    const { assertAuthenticated } = await import('../assert-authenticated.util');

    const getCurrentUserId = vi.fn().mockResolvedValue(null);

    await expect(assertAuthenticated(getCurrentUserId)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      name: 'AppError',
    });
  });

  it('throws UNAUTHORIZED when getCurrentUserId returns undefined', async () => {
    const { assertAuthenticated } = await import('../assert-authenticated.util');

    const getCurrentUserId = vi.fn().mockResolvedValue(undefined);

    await expect(assertAuthenticated(getCurrentUserId)).rejects.toBeInstanceOf(AppError);
  });

  it('passes custom message to createError when provided', async () => {
    const { assertAuthenticated } = await import('../assert-authenticated.util');

    const getCurrentUserId = vi.fn().mockResolvedValue(null);

    await expect(assertAuthenticated(getCurrentUserId, 'Acceso restringido')).rejects.toMatchObject(
      {
        code: 'UNAUTHORIZED',
        message: 'Acceso restringido',
      }
    );
  });

  it('calls getCurrentUserId exactly once', async () => {
    const { assertAuthenticated } = await import('../assert-authenticated.util');

    const getCurrentUserId = vi.fn().mockResolvedValue('user-1');

    await assertAuthenticated(getCurrentUserId);

    expect(getCurrentUserId).toHaveBeenCalledTimes(1);
  });

  it('uses default message when no custom message is provided', async () => {
    const { assertAuthenticated } = await import('../assert-authenticated.util');

    const getCurrentUserId = vi.fn().mockResolvedValue(null);

    await expect(assertAuthenticated(getCurrentUserId)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Debes iniciar sesión para realizar esta acción',
    });
  });
});
