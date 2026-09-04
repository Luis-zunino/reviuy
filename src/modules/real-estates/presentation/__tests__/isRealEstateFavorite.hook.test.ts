// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useIsRealEstateFavorite } from '../isRealEstateFavorite.hook';
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
  createIsRealEstateFavoriteQuery: vi.fn(() => vi.fn()),
}));

describe('useIsRealEstateFavorite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a mockUseQuery con los parámetros correctos', () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useIsRealEstateFavorite({ realEstateId: 'real-estate-123' }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['isFavorite', 'real-estate-123'],
        enabled: true,
        staleTime: 0,
      })
    );
  });

  it('debe deshabilitar la query cuando realEstateId está vacío', () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useIsRealEstateFavorite({ realEstateId: '' }));

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('debe retornar el estado de favorito', () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: true, isLoading: false } as any);

    const { result } = renderHook(() =>
      useIsRealEstateFavorite({ realEstateId: 'real-estate-123' })
    );

    expect(result.current.data).toBe(true);
  });

  it('invokes queryFn', async () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() => useIsRealEstateFavorite({ realEstateId: 'real-estate-123' }));

    const qf = (mockUseQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
