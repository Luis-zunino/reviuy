import { describe, expect, it, vi, beforeEach } from 'vitest';
import { reportReviewAction, reportRealEstateAction, reportRealEstateReviewAction } from '../report.actions';

vi.mock('server-only', () => ({}));

const mockUseCase = vi.hoisted(() => vi.fn().mockResolvedValue({ success: true, message: 'Reporte enviado' }));
const mockGetCurrentUserId = vi.hoisted(() => vi.fn());
const mockRateLimit = vi.hoisted(() => vi.fn());
const mockCreateServerActionDeps = vi.hoisted(() => vi.fn().mockResolvedValue({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
    },
  },
  getCurrentUserId: mockGetCurrentUserId,
  rateLimit: mockRateLimit,
}));

vi.mock('@/shared/auth/create-server-action-deps.util', () => ({
  createServerActionDeps: mockCreateServerActionDeps,
}));

vi.mock('@/modules/moderation/application', () => ({
  createReportReviewUseCase: vi.fn(() => mockUseCase),
  createReportRealEstateUseCase: vi.fn(() => mockUseCase),
  createReportRealEstateReviewUseCase: vi.fn(() => mockUseCase),
}));

vi.mock('@/modules/moderation/infrastructure', () => ({
  SupabaseModerationCommandRepository: vi.fn(),
}));

vi.mock('@/lib/errors', () => ({
  createError: vi.fn((code: string, message: string) => {
    const err: any = new Error(message);
    err.code = code;
    return err;
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockCreateServerActionDeps.mockResolvedValue({
    supabase: {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
      },
    },
    getCurrentUserId: mockGetCurrentUserId,
    rateLimit: mockRateLimit,
  });
  mockUseCase.mockResolvedValue({ success: true, message: 'Reporte enviado' });
});

describe('reportReviewAction', () => {
  it('returns success on valid input', async () => {
    const result = await reportReviewAction({ review_id: '00000000-0000-0000-0000-000000000001', reason: 'spam' });
    expect(result).toEqual({ success: true, message: 'Reporte enviado' });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    mockCreateServerActionDeps.mockResolvedValue({
      supabase: {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      },
      getCurrentUserId: mockGetCurrentUserId,
      rateLimit: mockRateLimit,
    });

    await expect(reportReviewAction({})).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it('propagates use case errors', async () => {
    mockUseCase.mockRejectedValue(new Error('Validation failed'));

    await expect(reportReviewAction({})).rejects.toThrow('Validation failed');
  });
});

describe('reportRealEstateAction', () => {
  it('returns success on valid input', async () => {
    const result = await reportRealEstateAction({ real_estate_id: '00000000-0000-0000-0000-000000000001', reason: 'spam' });
    expect(result).toEqual({ success: true, message: 'Reporte enviado' });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    mockCreateServerActionDeps.mockResolvedValue({
      supabase: {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      },
      getCurrentUserId: mockGetCurrentUserId,
      rateLimit: mockRateLimit,
    });

    await expect(reportRealEstateAction({})).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });
});

describe('reportRealEstateReviewAction', () => {
  it('returns success on valid input', async () => {
    const result = await reportRealEstateReviewAction({ review_id: '00000000-0000-0000-0000-000000000001', reason: 'spam' });
    expect(result).toEqual({ success: true, message: 'Reporte enviado' });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    mockCreateServerActionDeps.mockResolvedValue({
      supabase: {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      },
      getCurrentUserId: mockGetCurrentUserId,
      rateLimit: mockRateLimit,
    });

    await expect(reportRealEstateReviewAction({})).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });
});
