// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useGetReviewsByAddress } from '../getReviewsByAddress.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

vi.mock('@tanstack/react-query');
vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: {} as any,
}));
vi.mock('@/modules/property-reviews', () => ({
  createGetReviewsByAddressQuery: vi.fn(() => vi.fn()),
  SupabasePropertyReviewReadRepository: vi.fn(),
  ReviewWithVotesPublic: {},
}));

describe('useGetReviewsByAddress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data when useQuery succeeds', () => {
    const mockData = [
      { id: 'review-1', title: 'Great', rating: 5 },
      { id: 'review-2', title: 'Okay', rating: 3 },
    ];
    (useQuery as any).mockReturnValue({ data: mockData, isLoading: false, error: null });

    const { result } = renderHook(() => useGetReviewsByAddress({ osmId: 'osm-123' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getReviewsByAddress, 'osm-123'],
        enabled: true,
      })
    );
    expect(result.current.data).toEqual(mockData);
  });

  it('disables query when osmId is empty', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    renderHook(() => useGetReviewsByAddress({ osmId: '' }));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('invokes queryFn', async () => {
    (useQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useGetReviewsByAddress({ osmId: 'osm-123' }));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
