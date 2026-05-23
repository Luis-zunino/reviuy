import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUploadReviewImage } from '../uploadReviewImage.hook';
import { uploadReviewImageAction } from '../review-images.actions';

vi.mock('../review-images.actions', () => ({
  uploadReviewImageAction: vi.fn(),
}));

vi.mock('@/shared/auth/useAuthMutation.hook', () => ({
  useAuthMutation: vi.fn(({ mutationFn }) => ({
    mutate: mutationFn,
    mutateAsync: mutationFn,
    isPending: false,
    data: null,
    error: null,
  })),
}));

describe('useUploadReviewImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mutation object with expected properties', () => {
    const { result } = renderHook(() => useUploadReviewImage());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('mutateAsync');
    expect(result.current).toHaveProperty('isPending');
  });

  it('calls uploadReviewImageAction on mutate', async () => {
    const { result } = renderHook(() => useUploadReviewImage());

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = { reviewId: 'review-123', osmId: 'osm-123', file };
    await result.current.mutateAsync(input);

    expect(uploadReviewImageAction).toHaveBeenCalledWith(
      'review-123',
      'osm-123',
      expect.any(FormData)
    );
  });
});
