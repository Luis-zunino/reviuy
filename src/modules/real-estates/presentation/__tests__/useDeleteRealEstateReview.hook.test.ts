// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDeleteRealEstateReview } from '../useDeleteRealEstateReview.hook';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { deleteRealEstateReviewAction } from '@/modules/real-estates/presentation';

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
  deleteRealEstateReviewAction: vi.fn(),
}));

describe('useDeleteRealEstateReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useAuthMutation con la configuración esperada', () => {
    renderHook(() => useDeleteRealEstateReview());

    expect(useAuthMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationFn: expect.any(Function),
      })
    );
  });

  it('debe retornar el objeto de mutación', () => {
    const { result } = renderHook(() => useDeleteRealEstateReview());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current.isPending).toBe(false);
  });

  it('debe llamar a deleteRealEstateReviewAction al mutar', async () => {
    const { result } = renderHook(() => useDeleteRealEstateReview());

    await result.current.mutateAsync({ reviewId: 'review-123' });

    expect(deleteRealEstateReviewAction).toHaveBeenCalledWith('review-123');
  });
});
