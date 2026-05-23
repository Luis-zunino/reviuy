import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/auth/create-server-action-deps.util', () => ({
  createServerActionDeps: vi.fn(),
}));

const mockVoteRealEstateUseCase = vi.hoisted(() => vi.fn(() => vi.fn()));
const mockVoteRealEstateReviewUseCase = vi.hoisted(() => vi.fn(() => vi.fn()));
const mockToggleFavoriteUseCase = vi.hoisted(() => vi.fn(() => vi.fn()));

vi.mock('../../application', () => ({
  createVoteRealEstateUseCase: mockVoteRealEstateUseCase,
  createVoteRealEstateReviewUseCase: mockVoteRealEstateReviewUseCase,
  createToggleFavoriteRealEstateUseCase: mockToggleFavoriteUseCase,
}));

vi.mock('../../infrastructure', () => ({
  SupabaseRealEstateCommandRepository: vi.fn(),
}));

import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';
import {
  voteRealEstateAction,
  voteRealEstateReviewAction,
  toggleFavoriteRealEstateAction,
} from '../real-estate-interactions.actions';
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

describe('voteRealEstateAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
  });

  it('votes on a real estate when authenticated', async () => {
    const useCase = vi.fn().mockResolvedValue({ success: true });
    mockVoteRealEstateUseCase.mockReturnValue(useCase);

    const result = await voteRealEstateAction('real-estate-1', VoteType.LIKE);

    expect(result).toEqual({ success: true });
    expect(useCase).toHaveBeenCalledWith({ realEstateId: 'real-estate-1', voteType: VoteType.LIKE });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(voteRealEstateAction('real-estate-1', VoteType.LIKE)).rejects.toThrow(
      'Debés iniciar sesión.'
    );
    expect(mockVoteRealEstateUseCase).not.toHaveBeenCalled();
  });

  it('throws Zod error for invalid vote type', async () => {
    const useCase = vi.fn();
    mockVoteRealEstateUseCase.mockReturnValue(useCase);

    await expect(
      voteRealEstateAction('real-estate-1', 'INVALID' as VoteType)
    ).rejects.toThrow();
    expect(useCase).not.toHaveBeenCalled();
  });

  it('propagates use case errors', async () => {
    const useCase = vi.fn().mockRejectedValue(new Error('Vote failed'));
    mockVoteRealEstateUseCase.mockReturnValue(useCase);

    await expect(voteRealEstateAction('real-estate-1', VoteType.LIKE)).rejects.toThrow('Vote failed');
  });
});

describe('voteRealEstateReviewAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
  });

  it('votes on a real estate review when authenticated', async () => {
    const useCase = vi.fn().mockResolvedValue({ success: true });
    mockVoteRealEstateReviewUseCase.mockReturnValue(useCase);

    const result = await voteRealEstateReviewAction('review-1', VoteType.DISLIKE);

    expect(result).toEqual({ success: true });
    expect(useCase).toHaveBeenCalledWith({ reviewId: 'review-1', voteType: VoteType.DISLIKE });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(voteRealEstateReviewAction('review-1', VoteType.LIKE)).rejects.toThrow(
      'Debés iniciar sesión.'
    );
    expect(mockVoteRealEstateReviewUseCase).not.toHaveBeenCalled();
  });

  it('throws Zod error for invalid vote type', async () => {
    const useCase = vi.fn();
    mockVoteRealEstateReviewUseCase.mockReturnValue(useCase);

    await expect(
      voteRealEstateReviewAction('review-1', 'INVALID' as VoteType)
    ).rejects.toThrow();
    expect(useCase).not.toHaveBeenCalled();
  });

  it('propagates use case errors', async () => {
    const useCase = vi.fn().mockRejectedValue(new Error('Vote failed'));
    mockVoteRealEstateReviewUseCase.mockReturnValue(useCase);

    await expect(voteRealEstateReviewAction('review-1', VoteType.LIKE)).rejects.toThrow('Vote failed');
  });
});

describe('toggleFavoriteRealEstateAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
  });

  it('toggles favorite when authenticated', async () => {
    const useCase = vi.fn().mockResolvedValue({ favorited: true });
    mockToggleFavoriteUseCase.mockReturnValue(useCase);

    const result = await toggleFavoriteRealEstateAction('real-estate-1');

    expect(result).toEqual({ favorited: true });
    expect(useCase).toHaveBeenCalledWith({ realEstateId: 'real-estate-1' });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(toggleFavoriteRealEstateAction('real-estate-1')).rejects.toThrow(
      'Debés iniciar sesión.'
    );
    expect(mockToggleFavoriteUseCase).not.toHaveBeenCalled();
  });

  it('propagates use case errors', async () => {
    const useCase = vi.fn().mockRejectedValue(new Error('Toggle failed'));
    mockToggleFavoriteUseCase.mockReturnValue(useCase);

    await expect(toggleFavoriteRealEstateAction('real-estate-1')).rejects.toThrow('Toggle failed');
  });
});
