// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useGetCurrentUserReviews } from '../getCurrentUserReviews.hook';

vi.mock('@/modules/profiles', () => ({
  ComposedProfileReadRepository: vi.fn(),
  createGetCurrentUserReviewsQuery: vi.fn(() => vi.fn()),
}));
vi.mock('@/lib/supabase/client', () => ({ supabaseClient: {} }));
vi.mock('@/modules/property-reviews', () => ({ SupabasePropertyReviewReadRepository: vi.fn() }));
vi.mock('@/modules/real-estates', () => ({ SupabaseRealEstateReadRepository: vi.fn() }));

import { REVIEW_KEYS } from '@/constants/query-keys.constant';
const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

describe('useGetCurrentUserReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls mockUseQuery with correct queryKey', () => {
    (mockUseQuery as any).mockReturnValue({ data: null, isLoading: false });
    const { result } = renderHook(() => useGetCurrentUserReviews());

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: [REVIEW_KEYS.getReviewByUserId] })
    );
    expect(result.current.data).toBeNull();
  });
});
