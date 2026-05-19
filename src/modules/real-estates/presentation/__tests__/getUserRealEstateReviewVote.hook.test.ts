import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGetUserRealEstateReviewVote } from '../getUserRealEstateReviewVote.hook';
import { useQuery } from '@tanstack/react-query';
import { VoteType } from '@/types';
import { REAL_ESTATE_REVIEWS } from '@/constants';

vi.mock('@tanstack/react-query');
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
  supabaseClient: {},
}));

describe('useGetUserRealEstateReviewVote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useQuery con los parámetros correctos', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
      refetch: vi.fn(),
    } as any);

    renderHook(() => useGetUserRealEstateReviewVote({ reviewId: 'review-123' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REAL_ESTATE_REVIEWS.getUserRealEstateReviewVote, 'review-123'],
        enabled: true,
      })
    );
  });

  it('debe deshabilitar la query cuando reviewId está vacío', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
      refetch: vi.fn(),
    } as any);

    renderHook(() => useGetUserRealEstateReviewVote({ reviewId: '' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    );
  });

  it('debe retornar el voto del usuario cuando existe', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: VoteType.DISLIKE,
      isLoading: false,
      refetch: vi.fn(),
    } as any);

    const { result } = renderHook(() => useGetUserRealEstateReviewVote({ reviewId: 'review-123' }));

    expect(result.current.data).toBe(VoteType.DISLIKE);
  });
});
