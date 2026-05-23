import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useGetReviewVote } from '../getUserReviewVote.hook';
import { VoteType } from '@/types/vote-type';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

vi.mock('@tanstack/react-query');
vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: {} as any,
}));
vi.mock('@/modules/property-reviews', () => ({
  createGetUserReviewVoteQuery: vi.fn(() => vi.fn()),
  SupabasePropertyReviewReadRepository: vi.fn(),
}));

describe('useGetReviewVote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns vote data when useQuery succeeds', () => {
    (useQuery as any).mockReturnValue({ data: VoteType.LIKE, isLoading: false, error: null });

    const { result } = renderHook(() => useGetReviewVote({ reviewId: 'review-123' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getUserReviewVote, 'review-123'],
        enabled: true,
      })
    );
    expect(result.current.data).toBe(VoteType.LIKE);
  });

  it('disables query when reviewId is empty', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    renderHook(() => useGetReviewVote({ reviewId: '' }));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('returns null when user has not voted', () => {
    (useQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    const { result } = renderHook(() => useGetReviewVote({ reviewId: 'review-456' }));

    expect(result.current.data).toBeNull();
  });

  it('invokes queryFn', async () => {
    (useQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useGetReviewVote({ reviewId: 'review-123' }));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
