// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useGetReviewByUserId } from '../getReviewsByUserId.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';
const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

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

  it('returns data when mockUseQuery succeeds', () => {
    const mockData = [{ id: 'review-1', title: 'My review', rating: 4 }];
    (mockUseQuery as any).mockReturnValue({ data: mockData, isLoading: false, error: null });

    const { result } = renderHook(() => useGetReviewByUserId());

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getReviewByUserId],
      })
    );
    expect(result.current.data).toEqual(mockData);
  });

  it('returns empty array when user has no reviews', () => {
    (mockUseQuery as any).mockReturnValue({ data: [], isLoading: false, error: null });

    const { result } = renderHook(() => useGetReviewByUserId());

    expect(result.current.data).toEqual([]);
  });

  it('invokes queryFn', async () => {
    (mockUseQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useGetReviewByUserId());

    const qf = (mockUseQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
