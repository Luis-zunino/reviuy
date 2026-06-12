// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useGetCurrentUserFavoriteRealEstates } from '../getCurrentUserFavoriteRealEstates.hook';

vi.mock('@tanstack/react-query');
vi.mock('@/modules/profiles', () => ({
  ComposedProfileReadRepository: vi.fn(),
  createGetCurrentUserFavoriteRealEstatesQuery: vi.fn(() => vi.fn()),
}));
vi.mock('@/lib/supabase/client', () => ({ supabaseClient: {} }));
vi.mock('@/modules/property-reviews', () => ({ SupabasePropertyReviewReadRepository: vi.fn() }));
vi.mock('@/modules/real-estates', () => ({ SupabaseRealEstateReadRepository: vi.fn() }));

describe('useGetCurrentUserFavoriteRealEstates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls useQuery with correct queryKey', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false });
    const { result } = renderHook(() => useGetCurrentUserFavoriteRealEstates());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['favoriteRealEstates'] })
    );
    expect(result.current.data).toBeNull();
  });
});
