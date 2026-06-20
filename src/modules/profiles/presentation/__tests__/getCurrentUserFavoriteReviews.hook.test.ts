// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useGetCurrentUserFavoriteReviews } from '../getCurrentUserFavoriteReviews.hook';

vi.mock('@tanstack/react-query');
vi.mock('@/modules/profiles', () => ({
  ComposedProfileReadRepository: vi.fn(),
  createGetCurrentUserFavoriteReviewsQuery: vi.fn(() => vi.fn()),
}));
vi.mock('@/lib/supabase/client', () => ({ supabaseClient: {} }));
vi.mock('@/modules/property-reviews', () => ({ SupabasePropertyReviewReadRepository: vi.fn() }));
vi.mock('@/modules/real-estates', () => ({ SupabaseRealEstateReadRepository: vi.fn() }));

describe('useGetCurrentUserFavoriteReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls useQuery with correct queryKey', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false });
    const { result } = renderHook(() => useGetCurrentUserFavoriteReviews());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['favoriteReviews'] })
    );
    expect(result.current.data).toBeNull();
  });
});
