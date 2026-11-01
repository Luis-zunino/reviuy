// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useGetReviewVote } from '../getUserReviewVote.hook';
import { VoteType } from '@/types/vote-type';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';
const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

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

  it('returns vote data when mockUseQuery succeeds', () => {
    (mockUseQuery as any).mockReturnValue({ data: VoteType.LIKE, isLoading: false, error: null });

    const { result } = renderHook(() => useGetReviewVote({ reviewId: 'review-123' }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REVIEW_KEYS.getUserReviewVote, 'review-123'],
        enabled: true,
      })
    );
    expect(result.current.data).toBe(VoteType.LIKE);
  });

  it('disables query when reviewId is empty', () => {
    (mockUseQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    renderHook(() => useGetReviewVote({ reviewId: '' }));

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('returns null when user has not voted', () => {
    (mockUseQuery as any).mockReturnValue({ data: null, isLoading: false, error: null });

    const { result } = renderHook(() => useGetReviewVote({ reviewId: 'review-456' }));

    expect(result.current.data).toBeNull();
  });

  it('invokes queryFn', async () => {
    (mockUseQuery as any).mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderHook(() => useGetReviewVote({ reviewId: 'review-123' }));

    const qf = (mockUseQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
