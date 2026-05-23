import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGetRealEstateReviewByUserId } from '../getRealEstateReviewByUserId.hook';
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
  createGetRealEstateReviewByUserIdQuery: vi.fn(() => vi.fn()),
  RealEstateReviewWithVotesPublic: vi.fn(),
}));

describe('useGetRealEstateReviewByUserId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useQuery con los parámetros correctos', () => {
    vi.mocked(useQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useGetRealEstateReviewByUserId({ realEstateId: 'real-estate-123' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REAL_ESTATE_REVIEWS.getRealEstateReviewByUserId, 'real-estate-123'],
        enabled: true,
      })
    );
  });

  it('debe deshabilitar la query cuando realEstateId está vacío', () => {
    vi.mocked(useQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useGetRealEstateReviewByUserId({ realEstateId: '' }));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('debe retornar los datos de la query', () => {
    const mockData = { id: '1', title: 'Great review' };
    vi.mocked(useQuery).mockReturnValue({ data: mockData, isLoading: false } as any);

    const { result } = renderHook(() =>
      useGetRealEstateReviewByUserId({ realEstateId: 'real-estate-123' })
    );

    expect(result.current.data).toEqual(mockData);
  });

  it('invokes queryFn', async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() => useGetRealEstateReviewByUserId({ realEstateId: 'real-estate-123' }));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
