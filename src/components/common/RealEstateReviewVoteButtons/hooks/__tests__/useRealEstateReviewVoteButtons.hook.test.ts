import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRealEstateReviewVoteButtons } from '../useRealEstateReviewVoteButtons.hook';
import {
  useVoteRealEstateReview,
  useGetUserRealEstateReviewVote,
} from '@/modules/real-estates/presentation';
import { VoteType } from '@/types';
import { toast } from 'sonner';

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
  supabaseClient: {},
}));
vi.mock('@/modules/real-estates/presentation');
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('useRealEstateReviewVoteButtons', () => {
  const mockReviewId = 'review-123';
  const mockRefetchReview = vi.fn();
  const mockRefetchVote = vi.fn();
  const mockMutateAsync = vi.fn();

  const defaultProps = {
    reviewId: mockReviewId,
    refetchRealEstateReview: mockRefetchReview,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useVoteRealEstateReview).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);

    vi.mocked(useGetUserRealEstateReviewVote).mockReturnValue({
      data: null,
      refetch: mockRefetchVote,
    } as any);
  });

  it('debe retornar userVote como NONE cuando no hay voto del usuario', () => {
    const { result } = renderHook(() => useRealEstateReviewVoteButtons(defaultProps));

    expect(result.current.userVote).toBe(VoteType.NONE);
    expect(result.current.isPending).toBe(false);
  });

  it('debe retornar el voto del usuario cuando existe', () => {
    vi.mocked(useGetUserRealEstateReviewVote).mockReturnValue({
      data: VoteType.LIKE,
      refetch: mockRefetchVote,
    } as any);

    const { result } = renderHook(() => useRealEstateReviewVoteButtons(defaultProps));

    expect(result.current.userVote).toBe(VoteType.LIKE);
  });

  it('debe ejecutar mutateAsync, refetchear reseña y voto al votar exitosamente', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined);
    mockRefetchReview.mockResolvedValueOnce(undefined);
    mockRefetchVote.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useRealEstateReviewVoteButtons(defaultProps));

    await act(async () => {
      await result.current.handleVote(VoteType.LIKE);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith({
      reviewId: mockReviewId,
      voteType: VoteType.LIKE,
    });
    expect(mockRefetchReview).toHaveBeenCalled();
    expect(mockRefetchVote).toHaveBeenCalled();
  });

  it('debe mostrar toast error cuando mutateAsync falla', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('Error'));

    const { result } = renderHook(() => useRealEstateReviewVoteButtons(defaultProps));

    await act(async () => {
      await result.current.handleVote(VoteType.DISLIKE);
    });

    expect(toast.error).toHaveBeenCalledWith('Error inesperado', {
      description: 'No se pudo actualizar la reseña. Inténtalo de nuevo.',
    });
    expect(mockRefetchReview).not.toHaveBeenCalled();
    expect(mockRefetchVote).not.toHaveBeenCalled();
  });
});
