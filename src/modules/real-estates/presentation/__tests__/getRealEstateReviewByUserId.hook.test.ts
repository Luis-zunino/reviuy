// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGetRealEstateReviewByUserId } from '../getRealEstateReviewByUserId.hook';

import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';
const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
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

  it('debe llamar a mockUseQuery con los parámetros correctos', () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useGetRealEstateReviewByUserId({ realEstateId: 'real-estate-123' }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REAL_ESTATE_REVIEWS.getRealEstateReviewByUserId, 'real-estate-123'],
        enabled: true,
      })
    );
  });

  it('debe deshabilitar la query cuando realEstateId está vacío', () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useGetRealEstateReviewByUserId({ realEstateId: '' }));

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('debe retornar los datos de la query', () => {
    const mockData = { id: '1', title: 'Great review' };
    vi.mocked(mockUseQuery).mockReturnValue({ data: mockData, isLoading: false } as any);

    const { result } = renderHook(() =>
      useGetRealEstateReviewByUserId({ realEstateId: 'real-estate-123' })
    );

    expect(result.current.data).toEqual(mockData);
  });

  it('invokes queryFn', async () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() => useGetRealEstateReviewByUserId({ realEstateId: 'real-estate-123' }));

    const qf = (mockUseQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
