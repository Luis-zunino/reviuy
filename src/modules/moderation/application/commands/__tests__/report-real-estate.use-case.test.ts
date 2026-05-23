import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { createReportRealEstateUseCase } from '../report-real-estate.use-case';
import type { ModerationCommandRepository, ReportActionResponse } from '../../../domain';

vi.mock('@/shared/auth/assert-authenticated.util', () => ({
  assertAuthenticated: vi.fn(async (fn: () => Promise<string | null>) => {
    const result = await fn();
    if (result === null || result === undefined)
      throw Object.assign(new Error('No autorizado'), { code: 'UNAUTHORIZED' });
    return result;
  }),
}));

describe('createReportRealEstateUseCase', () => {
  const validInput = { real_estate_id: '550e8400-e29b-41d4-a716-446655440000', reason: 'spam' };

  it('rejects when user is not authenticated', async () => {
    const useCase = createReportRealEstateUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue(null),
      rateLimit: vi.fn(),
      repository: {
        reportReview: vi.fn(),
        reportRealEstate: vi.fn(),
        reportRealEstateReview: vi.fn(),
      },
    });

    await expect(useCase(validInput)).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it('rejects when rate limit throws', async () => {
    const useCase = createReportRealEstateUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
      rateLimit: vi.fn().mockRejectedValue(new Error('Rate limit')),
      repository: {
        reportReview: vi.fn(),
        reportRealEstate: vi.fn(),
        reportRealEstateReview: vi.fn(),
      },
    });

    await expect(useCase(validInput)).rejects.toThrow('Rate limit');
  });

  it('throws ZodError on invalid input', async () => {
    const useCase = createReportRealEstateUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
      rateLimit: vi.fn().mockResolvedValue(undefined),
      repository: {
        reportReview: vi.fn(),
        reportRealEstate: vi.fn(),
        reportRealEstateReview: vi.fn(),
      },
    });

    await expect(useCase({ real_estate_id: 'bad', reason: '' })).rejects.toBeInstanceOf(z.ZodError);
  });

  it('validates payload and delegates to repository', async () => {
    const expected: ReportActionResponse = { success: true, message: 'Reporte enviado' };
    const repository: ModerationCommandRepository = {
      reportReview: vi.fn(),
      reportRealEstate: vi.fn().mockResolvedValue(expected),
      reportRealEstateReview: vi.fn(),
    };
    const rateLimit = vi.fn().mockResolvedValue(undefined);

    const useCase = createReportRealEstateUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
      rateLimit,
      repository,
    });

    await expect(useCase(validInput)).resolves.toEqual(expected);
    expect(rateLimit).toHaveBeenCalledWith('report-real-estate:user-1', 'sensitive');
    expect(repository.reportRealEstate).toHaveBeenCalledWith(validInput);
  });

  it('rejects when repository throws', async () => {
    const repository: ModerationCommandRepository = {
      reportReview: vi.fn(),
      reportRealEstate: vi.fn().mockRejectedValue(new Error('DB error')),
      reportRealEstateReview: vi.fn(),
    };

    const useCase = createReportRealEstateUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
      rateLimit: vi.fn().mockResolvedValue(undefined),
      repository,
    });

    await expect(useCase(validInput)).rejects.toThrow('DB error');
  });
});
