// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useGetCurrentUserFavoriteReviews } from '../getCurrentUserFavoriteReviews.hook';
const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

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

  it('calls mockUseQuery with correct queryKey', () => {
    (mockUseQuery as any).mockReturnValue({ data: null, isLoading: false });
    const { result } = renderHook(() => useGetCurrentUserFavoriteReviews());

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['favoriteReviews'] })
    );
    expect(result.current.data).toBeNull();
  });
});
