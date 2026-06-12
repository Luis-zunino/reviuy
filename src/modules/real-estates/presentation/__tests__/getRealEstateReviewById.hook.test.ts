// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGetRealEstateReviewById } from '../getRealEstateReviewById.hook';
import { useQuery } from '@tanstack/react-query';
import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
  supabaseClient: {},
}));
vi.mock('@/modules/real-estates', () => ({
  SupabaseRealEstateReadRepository: vi.fn(),
  createGetRealEstateReviewByIdQuery: vi.fn(() => vi.fn()),
  RealEstateReviewWithVotesPublic: vi.fn(),
}));

describe('useGetRealEstateReviewById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useQuery con los parámetros correctos', () => {
    vi.mocked(useQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useGetRealEstateReviewById({ reviewId: 'review-123' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REAL_ESTATE_REVIEWS.getRealEstateReviewById],
        queryFn: expect.any(Function),
      })
    );
  });

  it('debe retornar los datos de la query', () => {
    const mockData = { id: '1', title: 'Great place' };
    vi.mocked(useQuery).mockReturnValue({ data: mockData, isLoading: false } as any);

    const { result } = renderHook(() => useGetRealEstateReviewById({ reviewId: 'review-123' }));

    expect(result.current.data).toEqual(mockData);
  });

  it('invokes queryFn', async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() => useGetRealEstateReviewById({ reviewId: 'review-123' }));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
