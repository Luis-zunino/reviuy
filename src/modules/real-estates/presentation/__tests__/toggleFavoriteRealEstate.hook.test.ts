// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useToggleFavoriteRealEstate } from '../toggleFavoriteRealEstate.hook';
import { useToggleFavorite } from '@/shared/api';
import { toggleFavoriteRealEstateAction } from '@/modules/real-estates/presentation';

vi.mock('@/shared/api', () => ({
  useToggleFavorite: vi.fn((mutationFn: any) => ({
    mutate: mutationFn,
    mutateAsync: mutationFn,
    isPending: false,
    data: null,
    error: null,
  })),
}));
vi.mock('@/modules/real-estates/presentation', () => ({
  toggleFavoriteRealEstateAction: vi.fn(),
}));

describe('useToggleFavoriteRealEstate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useToggleFavorite con los parámetros correctos', () => {
    renderHook(() => useToggleFavoriteRealEstate());

    expect(useToggleFavorite).toHaveBeenCalledWith(expect.any(Function), [
      ['realEstate'],
      ['favoriteRealEstates'],
      ['isFavorite'],
    ]);
  });

  it('debe retornar el objeto de mutación', () => {
    const { result } = renderHook(() => useToggleFavoriteRealEstate());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current.isPending).toBe(false);
  });

  it('debe llamar a toggleFavoriteRealEstateAction al mutar', async () => {
    const { result } = renderHook(() => useToggleFavoriteRealEstate());

    await result.current.mutateAsync({ realEstateId: 're-123' });

    expect(toggleFavoriteRealEstateAction).toHaveBeenCalledWith('re-123');
  });
});
