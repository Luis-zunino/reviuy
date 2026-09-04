// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGetUserFavoriteRealEstates } from '../getUserFavoriteRealEstates.hook';
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
  createGetUserFavoriteRealEstatesQuery: vi.fn(() => vi.fn()),
}));

describe('useGetUserFavoriteRealEstates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a mockUseQuery con los parámetros correctos', () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useGetUserFavoriteRealEstates());

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['favoriteRealEstates'],
        queryFn: expect.any(Function),
      })
    );
  });

  it('debe retornar los datos de la query', () => {
    const mockData = [{ id: '1', name: 'Favorite 1' }];
    vi.mocked(mockUseQuery).mockReturnValue({ data: mockData, isLoading: false } as any);

    const { result } = renderHook(() => useGetUserFavoriteRealEstates());

    expect(result.current.data).toEqual(mockData);
  });

  it('invokes queryFn', async () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() => useGetUserFavoriteRealEstates());

    const qf = (mockUseQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
