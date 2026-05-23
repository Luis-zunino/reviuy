import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGetUserFavoriteRealEstates } from '../getUserFavoriteRealEstates.hook';
import { useQuery } from '@tanstack/react-query';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
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

  it('debe llamar a useQuery con los parámetros correctos', () => {
    vi.mocked(useQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useGetUserFavoriteRealEstates());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['favoriteRealEstates'],
        queryFn: expect.any(Function),
      })
    );
  });

  it('debe retornar los datos de la query', () => {
    const mockData = [{ id: '1', name: 'Favorite 1' }];
    vi.mocked(useQuery).mockReturnValue({ data: mockData, isLoading: false } as any);

    const { result } = renderHook(() => useGetUserFavoriteRealEstates());

    expect(result.current.data).toEqual(mockData);
  });

  it('invokes queryFn', async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() => useGetUserFavoriteRealEstates());

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
