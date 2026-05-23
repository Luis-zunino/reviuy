import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useGetReviewByUserId } from '../getReviewsByUserId.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

vi.mock('@tanstack/react-query');
vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: {} as any,
}));
vi.mock('@/modules/property-reviews', () => ({
  createGetReviewsByUserIdQuery: vi.fn(() => vi.fn()),
  SupabasePropertyReviewReadRepository: vi.fn(),
  ReviewWithVotesPublic: {},
}));

describe('useGetReviewByUserId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data when useQuery succeeds', () => {
    const mockData = [{ id: 'review-1', title: 'My review', rating: 4 }];
    (useQuery as any).mockReturnValue({ data: mockData, isLoading: false, error: null });

    const { result } = renderHook(() => useGetReviewByUserId());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getReviewByUserId],
      })
    );
    expect(result.current.data).toEqual(mockData);
  });

  it('returns empty array when user has no reviews', () => {
    (useQuery as any).mockReturnValue({ data: [], isLoading: false, error: null });

    const { result } = renderHook(() => useGetReviewByUserId());

    expect(result.current.data).toEqual([]);
  });

  it('invokes queryFn', async () => {
    (useQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useGetReviewByUserId());

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
