// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useGetUserFavoriteReviews } from '../useGetUserFavoriteReviews.hook';
const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: {} as any,
}));
vi.mock('@/modules/property-reviews', () => ({
  createGetUserFavoriteReviewsQuery: vi.fn(() => vi.fn()),
  SupabasePropertyReviewReadRepository: vi.fn(),
}));

describe('useGetUserFavoriteReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data when mockUseQuery succeeds', () => {
    const mockData = [{ id: '1', title: 'Great Place' }];
    (mockUseQuery as any).mockReturnValue({ data: mockData, isLoading: false, error: null });

    const { result } = renderHook(() => useGetUserFavoriteReviews());

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['favoriteReviews'],
      })
    );
    expect(result.current.data).toEqual(mockData);
  });

  it('returns empty array when no favorites', () => {
    (mockUseQuery as any).mockReturnValue({ data: [], isLoading: false, error: null });

    const { result } = renderHook(() => useGetUserFavoriteReviews());

    expect(result.current.data).toEqual([]);
  });

  it('invokes queryFn', async () => {
    (mockUseQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useGetUserFavoriteReviews());

    const qf = (mockUseQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
