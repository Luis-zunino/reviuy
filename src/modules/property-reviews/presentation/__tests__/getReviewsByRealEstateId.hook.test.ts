// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useGetReviewsByRealEstateId } from '../getReviewsByRealEstateId.hook';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

vi.mock('@tanstack/react-query');
vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: {} as any,
}));
vi.mock('@/modules/property-reviews', () => ({
  createGetReviewsByRealEstateIdQuery: vi.fn(() => vi.fn()),
  SupabasePropertyReviewReadRepository: vi.fn(),
  ReviewWithVotesPublic: {},
}));
vi.mock('@/constants/uuid-regex.constant', () => ({
  UUID_REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
}));

describe('useGetReviewsByRealEstateId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data for a valid UUID', () => {
    const mockData = [{ id: 'review-1', title: 'Great' }];
    (useQuery as any).mockReturnValue({ data: mockData, isLoading: false, error: null });

    const validUuid = '550e8400-e29b-41d4-a716-446655440000';
    const { result } = renderHook(() => useGetReviewsByRealEstateId(validUuid));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getReviewsByRealEstateId, validUuid],
        enabled: true,
      })
    );
    expect(result.current.data).toEqual(mockData);
  });

  it('disables query when realEstateId is not a valid UUID', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    renderHook(() => useGetReviewsByRealEstateId('invalid-id'));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('invokes queryFn', async () => {
    (useQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    const validUuid = '550e8400-e29b-41d4-a716-446655440000';
    renderHook(() => useGetReviewsByRealEstateId(validUuid));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
