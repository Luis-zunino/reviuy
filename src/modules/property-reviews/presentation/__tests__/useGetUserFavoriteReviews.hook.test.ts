import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useGetUserFavoriteReviews } from '../useGetUserFavoriteReviews.hook';

vi.mock('@tanstack/react-query');
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

  it('returns data when useQuery succeeds', () => {
    const mockData = [{ id: '1', title: 'Great Place' }];
    (useQuery as any).mockReturnValue({ data: mockData, isLoading: false, error: null });

    const { result } = renderHook(() => useGetUserFavoriteReviews());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['favoriteReviews'],
      })
    );
    expect(result.current.data).toEqual(mockData);
  });

  it('returns empty array when no favorites', () => {
    (useQuery as any).mockReturnValue({ data: [], isLoading: false, error: null });

    const { result } = renderHook(() => useGetUserFavoriteReviews());

    expect(result.current.data).toEqual([]);
  });

  it('invokes queryFn', async () => {
    (useQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useGetUserFavoriteReviews());

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
