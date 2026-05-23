import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateRealEstateReviewHook } from '../updateRealEstateReview.hook';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { updateRealEstateReviewAction } from '@/modules/real-estates/presentation';

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
  updateRealEstateReviewAction: vi.fn(),
}));

describe('useUpdateRealEstateReviewHook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useAuthMutation con la configuración esperada', () => {
    renderHook(() => useUpdateRealEstateReviewHook());

    expect(useAuthMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        authErrorMessage: 'Debes iniciar sesión para actualizar una reseña de una inmobiliaria',
        invalidateQueryKeys: expect.arrayContaining([[expect.any(String)]]),
      })
    );
  });

  it('debe retornar el objeto de mutación', () => {
    const { result } = renderHook(() => useUpdateRealEstateReviewHook());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current.isPending).toBe(false);
  });

  it('debe llamar a updateRealEstateReviewAction al mutar', async () => {
    const { result } = renderHook(() => useUpdateRealEstateReviewHook());

    const input = { id: 'review-123', title: 'Updated', description: 'Updated description', rating: 5 };
    await result.current.mutateAsync(input);

    const { id, ...data } = input;
    expect(updateRealEstateReviewAction).toHaveBeenCalledWith(id, data);
  });
});
