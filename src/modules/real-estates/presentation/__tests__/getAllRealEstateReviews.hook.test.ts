import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGetAllRealEstateReviews } from '../getAllRealEstateReviews.hook';
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
  createGetAllRealEstateReviewsQuery: vi.fn(() => vi.fn()),
  RealEstateReviewWithVotesPublic: vi.fn(),
}));

describe('useGetAllRealEstateReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useQuery con los parámetros correctos para un UUID válido', () => {
    vi.mocked(useQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() =>
      useGetAllRealEstateReviews({ id: '550e8400-e29b-41d4-a716-446655440000', limit: 10 })
    );

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [
          REAL_ESTATE_REVIEWS.getAllRealEstateReviews,
          '550e8400-e29b-41d4-a716-446655440000',
          10,
        ],
        enabled: true,
      })
    );
  });

  it('debe deshabilitar la query cuando el id no es un UUID válido', () => {
    vi.mocked(useQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useGetAllRealEstateReviews({ id: 'invalid-id' }));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('debe retornar los datos de la query', () => {
    const mockData = [{ id: '1', title: 'Test' }];
    vi.mocked(useQuery).mockReturnValue({ data: mockData, isLoading: false } as any);

    const { result } = renderHook(() =>
      useGetAllRealEstateReviews({ id: '550e8400-e29b-41d4-a716-446655440000' })
    );

    expect(result.current.data).toEqual(mockData);
  });

  it('invokes queryFn', async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() =>
      useGetAllRealEstateReviews({ id: '550e8400-e29b-41d4-a716-446655440000', limit: 10 })
    );

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
