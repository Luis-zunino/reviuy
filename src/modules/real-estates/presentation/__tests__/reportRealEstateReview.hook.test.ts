import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  useReportRealEstateReview,
  useHasUserReportedRealEstateReview,
} from '../reportRealEstateReview.hook';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { useQuery } from '@tanstack/react-query';
import { reportRealEstateReviewAction } from '@/modules/moderation/presentation';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
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
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
  supabaseClient: {},
}));
vi.mock('@/modules/real-estates', () => ({
  SupabaseRealEstateReadRepository: vi.fn(),
  createHasUserReportedRealEstateReviewQuery: vi.fn(() => vi.fn()),
}));
vi.mock('@/modules/moderation/presentation', () => ({
  reportRealEstateReviewAction: vi.fn(),
}));

describe('useReportRealEstateReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useAuthMutation', () => {
    renderHook(() => useReportRealEstateReview());

    expect(useAuthMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationFn: expect.any(Function),
      })
    );
  });

  it('debe retornar el objeto de mutación', () => {
    const { result } = renderHook(() => useReportRealEstateReview());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current.isPending).toBe(false);
  });

  it('debe llamar a reportRealEstateReviewAction al mutar', async () => {
    const { result } = renderHook(() => useReportRealEstateReview());

    const input = { reviewId: 'review-123', reason: 'spam' };
    await result.current.mutateAsync(input);

    expect(reportRealEstateReviewAction).toHaveBeenCalledWith(input);
  });
});

describe('useHasUserReportedRealEstateReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useQuery con los parámetros correctos', () => {
    vi.mocked(useQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useHasUserReportedRealEstateReview('review-123'));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['has-user-reported-real-estate-review', 'review-123'],
        enabled: true,
        staleTime: 5 * 60 * 1000,
      })
    );
  });

  it('debe deshabilitar la query cuando reviewId está vacío', () => {
    vi.mocked(useQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useHasUserReportedRealEstateReview(''));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('debe retornar el estado de reporte', () => {
    vi.mocked(useQuery).mockReturnValue({ data: false, isLoading: false } as any);

    const { result } = renderHook(() =>
      useHasUserReportedRealEstateReview('review-123')
    );

    expect(result.current.data).toBe(false);
  });

  it('invokes queryFn', async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() => useHasUserReportedRealEstateReview('review-123'));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
