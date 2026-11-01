// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSearchRealEstates } from '../searchRealEstates.hook';

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
  createSearchRealEstatesQuery: vi.fn(() => vi.fn()),
  RealEstateWithVotesPublic: vi.fn(),
}));

describe('useSearchRealEstates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a mockUseQuery con los parámetros correctos cuando query tiene al menos 3 caracteres', () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: [], isLoading: false } as any);

    renderHook(() => useSearchRealEstates({ query: 'abc', limit: 5 }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REAL_ESTATE_REVIEWS.searchRealEstates, 'abc', 5],
        enabled: true,
      })
    );
  });

  it('debe deshabilitar la query cuando query tiene menos de 3 caracteres', () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: [], isLoading: false } as any);

    renderHook(() => useSearchRealEstates({ query: 'ab' }));

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('debe retornar los resultados de búsqueda', () => {
    const mockResults = [{ id: '1', name: 'Result 1' }];
    vi.mocked(mockUseQuery).mockReturnValue({ data: mockResults, isLoading: false } as any);

    const { result } = renderHook(() => useSearchRealEstates({ query: 'example', limit: 10 }));

    expect(result.current.data).toEqual(mockResults);
  });

  it('invokes queryFn', async () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() => useSearchRealEstates({ query: 'abc', limit: 5 }));

    const qf = (mockUseQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
