// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: {} as any,
}));

vi.mock('@/shared/auth/useAuthMutation.hook', () => ({
  useAuthMutation: vi.fn(({ mutationFn }) => ({
    mutate: mutationFn,
    mutateAsync: mutationFn,
    isPending: false,
    data: null,
    error: null,
  })),
}));

vi.mock('@/modules/moderation/presentation', () => ({
  reportReviewAction: vi.fn(),
}));

vi.mock('@/modules/property-reviews', () => ({
  createHasUserReportedReviewQuery: vi.fn(() => vi.fn()),
  SupabasePropertyReviewReadRepository: vi.fn(),
}));

describe('useReportReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mutation object with expected properties', async () => {
    const { useReportReview } = await import('../reportReview.hook');

    const { result } = renderHook(() => useReportReview());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('mutateAsync');
    expect(result.current).toHaveProperty('isPending');
  });

  it('calls reportReviewAction on mutate', async () => {
    const reportMock = vi.mocked(
      (await import('@/modules/moderation/presentation')).reportReviewAction
    );

    const { useReportReview } = await import('../reportReview.hook');
    const { result } = renderHook(() => useReportReview());

    const input = { reviewId: 'review-123', reason: 'spam' };
    await result.current.mutateAsync(input);

    expect(reportMock).toHaveBeenCalledWith(input);
  });
});

describe('useHasUserReportedReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data when useQuery succeeds', async () => {
    mockUseQuery.mockReturnValue({ data: true, isLoading: false, error: null });
    const { useHasUserReportedReview } = await import('../reportReview.hook');

    const { result } = renderHook(() => useHasUserReportedReview('review-123'));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['has-user-reported-review', 'review-123'],
        enabled: true,
        staleTime: 5 * 60 * 1000,
      })
    );
    expect(result.current.data).toBe(true);
  });

  it('disables query when reviewId is empty', async () => {
    mockUseQuery.mockReturnValue({ data: null, isLoading: false, error: null });
    const { useHasUserReportedReview } = await import('../reportReview.hook');

    renderHook(() => useHasUserReportedReview(''));

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('invokes queryFn', async () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, error: null });
    const { useHasUserReportedReview } = await import('../reportReview.hook');

    renderHook(() => useHasUserReportedReview('review-123'));

    const call = mockUseQuery.mock.calls.at(-1);
    expect(call).toBeDefined();
    const qf = call![0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
