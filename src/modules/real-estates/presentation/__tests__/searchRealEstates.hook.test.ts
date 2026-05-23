import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSearchRealEstates } from '../searchRealEstates.hook';
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
  createSearchRealEstatesQuery: vi.fn(() => vi.fn()),
  RealEstateWithVotesPublic: vi.fn(),
}));

describe('useSearchRealEstates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useQuery con los parámetros correctos cuando query tiene al menos 3 caracteres', () => {
    vi.mocked(useQuery).mockReturnValue({ data: [], isLoading: false } as any);

    renderHook(() => useSearchRealEstates({ query: 'abc', limit: 5 }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REAL_ESTATE_REVIEWS.searchRealEstates, 'abc', 5],
        enabled: true,
      })
    );
  });

  it('debe deshabilitar la query cuando query tiene menos de 3 caracteres', () => {
    vi.mocked(useQuery).mockReturnValue({ data: [], isLoading: false } as any);

    renderHook(() => useSearchRealEstates({ query: 'ab' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('debe retornar los resultados de búsqueda', () => {
    const mockResults = [{ id: '1', name: 'Result 1' }];
    vi.mocked(useQuery).mockReturnValue({ data: mockResults, isLoading: false } as any);

    const { result } = renderHook(() =>
      useSearchRealEstates({ query: 'example', limit: 10 })
    );

    expect(result.current.data).toEqual(mockResults);
  });

  it('invokes queryFn', async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() => useSearchRealEstates({ query: 'abc', limit: 5 }));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
