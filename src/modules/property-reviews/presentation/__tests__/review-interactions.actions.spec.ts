import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/auth/create-server-action-deps.util', () => ({
  createServerActionDeps: vi.fn(),
}));

const mockVoteUseCase = vi.hoisted(() => vi.fn(() => vi.fn()));
const mockToggleFavoriteUseCase = vi.hoisted(() => vi.fn(() => vi.fn()));

vi.mock('../../application', () => ({
  createVotePropertyReviewUseCase: mockVoteUseCase,
  createToggleFavoritePropertyReviewUseCase: mockToggleFavoriteUseCase,
}));

vi.mock('../../infrastructure', () => ({
  SupabasePropertyReviewCommandRepository: vi.fn(),
}));

const mockRevalidatePath = vi.hoisted(() => vi.fn());

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';
import {
  voteReviewAction,
  toggleFavoriteReviewAction,
} from '../review-interactions.actions';
import { VoteType } from '@/types/vote-type';

const mockDeps = (overrides = {}) => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
    },
  },
  getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
  rateLimit: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('voteReviewAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
  });

  it('votes on a review when authenticated', async () => {
    const useCase = vi.fn().mockResolvedValue({ success: true });
    mockVoteUseCase.mockReturnValue(useCase);

    const result = await voteReviewAction('review-1', VoteType.LIKE);

    expect(result).toEqual({ success: true });
    expect(useCase).toHaveBeenCalledWith({ reviewId: 'review-1', voteType: VoteType.LIKE });
  });

  it('revalidates path when provided', async () => {
    const useCase = vi.fn().mockResolvedValue({ success: true });
    mockVoteUseCase.mockReturnValue(useCase);

    await voteReviewAction('review-1', VoteType.LIKE, '/some-path');

    expect(mockRevalidatePath).toHaveBeenCalledWith('/some-path');
  });

  it('does not revalidate when path is not provided', async () => {
    const useCase = vi.fn().mockResolvedValue({ success: true });
    mockVoteUseCase.mockReturnValue(useCase);

    await voteReviewAction('review-1', VoteType.LIKE);

    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(voteReviewAction('review-1', VoteType.LIKE)).rejects.toThrow('Debés iniciar sesión.');
    expect(mockVoteUseCase).not.toHaveBeenCalled();
  });

  it('propagates use case errors', async () => {
    const useCase = vi.fn().mockRejectedValue(new Error('Vote failed'));
    mockVoteUseCase.mockReturnValue(useCase);

    await expect(voteReviewAction('review-1', VoteType.LIKE)).rejects.toThrow('Vote failed');
  });
});

describe('toggleFavoriteReviewAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
  });

  it('toggles favorite when authenticated', async () => {
    const useCase = vi.fn().mockResolvedValue({ favorited: true });
    mockToggleFavoriteUseCase.mockReturnValue(useCase);

    const result = await toggleFavoriteReviewAction('review-1');

    expect(result).toEqual({ favorited: true });
    expect(useCase).toHaveBeenCalledWith({ reviewId: 'review-1' });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(toggleFavoriteReviewAction('review-1')).rejects.toThrow('Debés iniciar sesión.');
    expect(mockToggleFavoriteUseCase).not.toHaveBeenCalled();
  });

  it('propagates use case errors', async () => {
    const useCase = vi.fn().mockRejectedValue(new Error('Toggle failed'));
    mockToggleFavoriteUseCase.mockReturnValue(useCase);

    await expect(toggleFavoriteReviewAction('review-1')).rejects.toThrow('Toggle failed');
  });
});
