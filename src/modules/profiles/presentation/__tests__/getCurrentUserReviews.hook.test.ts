import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useGetCurrentUserReviews } from '../getCurrentUserReviews.hook';

vi.mock('@tanstack/react-query');
vi.mock('@/modules/profiles', () => ({
  ComposedProfileReadRepository: vi.fn(),
  createGetCurrentUserReviewsQuery: vi.fn(() => vi.fn()),
}));
vi.mock('@/lib/supabase/client', () => ({ supabaseClient: {} }));
vi.mock('@/modules/property-reviews', () => ({ SupabasePropertyReviewReadRepository: vi.fn() }));
vi.mock('@/modules/real-estates', () => ({ SupabaseRealEstateReadRepository: vi.fn() }));

import { REVIEW_KEYS } from '@/constants/query-keys.constant';

describe('useGetCurrentUserReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls useQuery with correct queryKey', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false });
    const { result } = renderHook(() => useGetCurrentUserReviews());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: [REVIEW_KEYS.getReviewByUserId] })
    );
    expect(result.current.data).toBeNull();
  });
});
