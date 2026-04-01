import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VoteType } from '@/types';
import type { PropertyReviewCommandRepository } from '../../domain';
import { createVotePropertyReviewUseCase } from './vote-property-review.use-case';
import type { VotePropertyReviewDependencies } from './vote-property-review.use-case';

describe('createVotePropertyReviewUseCase', () => {
  let dependencies: VotePropertyReviewDependencies;
  let getCurrentUserId: ReturnType<typeof vi.fn>;
  let rateLimit: ReturnType<typeof vi.fn>;
  let voteReview: ReturnType<typeof vi.fn>;

  const repository = (): PropertyReviewCommandRepository => ({
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    vote: voteReview,
    toggleFavorite: vi.fn(),
  });

  const validInput = {
    reviewId: '550e8400-e29b-41d4-a716-446655440000',
    voteType: VoteType.LIKE,
  };

  beforeEach(() => {
    getCurrentUserId = vi.fn();
    rateLimit = vi.fn().mockResolvedValue(undefined);
    voteReview = vi.fn();

    dependencies = {
      getCurrentUserId,
      rateLimit,
      propertyReviewCommandRepository: repository(),
    };
  });

  it('returns UNAUTHORIZED when the user is missing', async () => {
    getCurrentUserId.mockResolvedValueOnce(null);
    const execute = createVotePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual({
      success: false,
      message: 'No autorizado',
      error: 'UNAUTHORIZED',
    });
  });

  it('applies rate limiting before delegating', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    voteReview.mockResolvedValueOnce({ success: true, message: 'ok' });
    const execute = createVotePropertyReviewUseCase(dependencies);

    await execute(validInput);

    expect(rateLimit).toHaveBeenCalledWith('vote-review:user-123', 'vote');
    expect(voteReview).toHaveBeenCalledWith(validInput);
  });

  it('rejects invalid UUIDs before hitting the repository', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const execute = createVotePropertyReviewUseCase(dependencies);

    await expect(
      execute({
        reviewId: 'invalid-id',
        voteType: VoteType.LIKE,
      })
    ).rejects.toThrow();

    expect(voteReview).not.toHaveBeenCalled();
  });

  it('propagates rate limit failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    rateLimit.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const execute = createVotePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Rate limit exceeded');
  });

  it('returns the repository result as-is', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const repositoryResult = { success: true, message: 'Vote recorded successfully' };
    voteReview.mockResolvedValueOnce(repositoryResult);
    const execute = createVotePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual(repositoryResult);
  });
});
