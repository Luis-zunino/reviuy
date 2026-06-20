// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useGetCurrentUserSummary } from '../getCurrentUserSummary.hook';

vi.mock('@tanstack/react-query');
vi.mock('@/modules/profiles', () => ({
  ComposedProfileReadRepository: vi.fn(),
  createGetCurrentUserSummaryQuery: vi.fn(() => vi.fn()),
}));
vi.mock('@/lib/supabase/client', () => ({ supabaseClient: {} }));
vi.mock('@/modules/property-reviews', () => ({ SupabasePropertyReviewReadRepository: vi.fn() }));
vi.mock('@/modules/real-estates', () => ({ SupabaseRealEstateReadRepository: vi.fn() }));

describe('useGetCurrentUserSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls useQuery with correct queryKey', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false });
    const { result } = renderHook(() => useGetCurrentUserSummary());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['currentUserSummary'] })
    );
    expect(result.current.data).toBeNull();
  });
});
