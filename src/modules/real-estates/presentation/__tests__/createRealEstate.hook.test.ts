import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateRealEstateHook } from '../createRealEstate.hook';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { createRealEstateAction } from '@/modules/real-estates/presentation';

vi.mock('@/shared/auth/useAuthMutation.hook', () => ({
  useAuthMutation: vi.fn(({ mutationFn }) => ({
    mutate: mutationFn,
    mutateAsync: mutationFn,
    isPending: false,
    data: null,
    error: null,
  })),
}));
vi.mock('@/modules/real-estates/presentation', () => ({
  createRealEstateAction: vi.fn(),
}));

describe('useCreateRealEstateHook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useAuthMutation con la configuración esperada', () => {
    renderHook(() => useCreateRealEstateHook());

    expect(useAuthMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationKey: ['create-real-estate'],
        authErrorMessage: 'Debes iniciar sesión para crear una inmobiliaria',
      })
    );
  });

  it('debe retornar el objeto de mutación', () => {
    const { result } = renderHook(() => useCreateRealEstateHook());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current.isPending).toBe(false);
  });

  it('debe llamar a createRealEstateAction al mutar', async () => {
    const { result } = renderHook(() => useCreateRealEstateHook());

    const input = { real_estate_name: 'New Real Estate' };
    await result.current.mutateAsync(input);

    expect(createRealEstateAction).toHaveBeenCalledWith(input);
  });
});
