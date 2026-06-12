// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useGetReviewById } from '../getReviewById.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

vi.mock('@tanstack/react-query');
vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: {} as any,
}));
vi.mock('@/modules/property-reviews', () => ({
  createGetReviewByIdQuery: vi.fn(() => vi.fn()),
  SupabasePropertyReviewReadRepository: vi.fn(),
  ReviewPublicWithRelations: {},
}));

describe('useGetReviewById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data when useQuery succeeds', () => {
    const mockData = { id: 'review-1', title: 'Great property', content: 'Loved it' };
    (useQuery as any).mockReturnValue({ data: mockData, isLoading: false, error: null });

    const { result } = renderHook(() => useGetReviewById({ id: 'review-1' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getReviewById, 'review-1'],
        enabled: true,
      })
    );
    expect(result.current.data).toEqual(mockData);
  });

  it('disables query when id is empty', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    renderHook(() => useGetReviewById({ id: '' }));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('returns null when review is not found', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    const { result } = renderHook(() => useGetReviewById({ id: 'nonexistent' }));

    expect(result.current.data).toBeNull();
  });

  it('invokes queryFn', async () => {
    (useQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useGetReviewById({ id: 'review-1' }));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
