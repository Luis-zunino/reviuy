// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateReview } from '../createReview.hook';
vi.mock('@/modules/property-reviews/presentation', () => ({
  createReviewAction: vi.fn(),
}));

import { createReviewAction } from '@/modules/property-reviews/presentation';

vi.mock('@/shared/auth/useAuthMutation.hook', () => ({
  useAuthMutation: vi.fn(({ mutationFn }) => ({
    mutate: mutationFn,
    mutateAsync: mutationFn,
    isPending: false,
    data: null,
    error: null,
  })),
}));

describe('useCreateReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mutation object with expected properties', () => {
    const { result } = renderHook(() => useCreateReview());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('mutateAsync');
    expect(result.current).toHaveProperty('isPending');
  });

  it('calls createReviewAction on mutate', async () => {
    const { result } = renderHook(() => useCreateReview());

    const input = {
      title: 'Test Review',
      description: 'Great place',
      rating: 5,
      address_osm_id: 'osm-123',
      address_text: '123 Main St',
      latitude: -34.6037,
      longitude: -58.3816,
    };

    await result.current.mutateAsync(input);

    expect(createReviewAction).toHaveBeenCalledWith(input);
  });
});
