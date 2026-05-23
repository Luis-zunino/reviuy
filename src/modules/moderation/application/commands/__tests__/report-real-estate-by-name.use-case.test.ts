import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { createReportRealEstateByNameUseCase } from '../report-real-estate-by-name.use-case';

vi.mock('@/shared/auth/assert-authenticated.util', () => ({
  assertAuthenticated: vi.fn(async (fn: () => Promise<string | null>) => {
    const result = await fn();
    if (result === null || result === undefined)
      throw Object.assign(new Error('No autorizado'), { code: 'UNAUTHORIZED' });
    return result;
  }),
}));

describe('createReportRealEstateByNameUseCase', () => {
  const validInput = { realEstateName: 'Inmobiliaria Test', reason: 'spam', message: 'No existe' };

  it('rejects when user is not authenticated', async () => {
    const useCase = createReportRealEstateByNameUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue(null),
      rateLimit: vi.fn(),
    });

    await expect(useCase(validInput)).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it('rejects when rate limit throws', async () => {
    const useCase = createReportRealEstateByNameUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
      rateLimit: vi.fn().mockRejectedValue(new Error('Rate limit')),
    });

    await expect(useCase(validInput)).rejects.toThrow('Rate limit');
  });

  it('throws ZodError on invalid input', async () => {
    const useCase = createReportRealEstateByNameUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
      rateLimit: vi.fn().mockResolvedValue(undefined),
    });

    await expect(useCase({ realEstateName: '', reason: '', message: '' })).rejects.toBeInstanceOf(
      z.ZodError
    );
  });

  it('returns validated response on success', async () => {
    const rateLimit = vi.fn().mockResolvedValue(undefined);

    const useCase = createReportRealEstateByNameUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
      rateLimit,
    });

    const result = await useCase(validInput);

    expect(result).toEqual({ success: true, message: 'Reporte validado' });
    expect(rateLimit).toHaveBeenCalledWith('report-real-estate:user-1', 'sensitive');
  });
});
