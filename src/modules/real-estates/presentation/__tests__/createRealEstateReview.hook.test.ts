import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateRealEstateReviewHook } from '../createRealEstateReview.hook';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { createRealEstateReviewAction } from '@/modules/real-estates/presentation';

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
  createRealEstateReviewAction: vi.fn(),
}));

describe('useCreateRealEstateReviewHook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useAuthMutation con la configuración esperada', () => {
    renderHook(() => useCreateRealEstateReviewHook());

    expect(useAuthMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        authErrorMessage: 'Debes iniciar sesión para crear una reseña de una inmobiliaria',
      })
    );
  });

  it('debe retornar el objeto de mutación', () => {
    const { result } = renderHook(() => useCreateRealEstateReviewHook());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current.isPending).toBe(false);
  });

  it('debe llamar a createRealEstateReviewAction al mutar', async () => {
    const { result } = renderHook(() => useCreateRealEstateReviewHook());

    const input = { title: 'Test Review', description: 'Great', rating: 4, real_estate_id: 're-1' };
    await result.current.mutateAsync(input);

    expect(createRealEstateReviewAction).toHaveBeenCalledWith(input);
  });
});
