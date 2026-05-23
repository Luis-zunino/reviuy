import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { RealEstateCommandoBase } from '../interfaces';
import { createVoteRealEstateReviewUseCase } from '../vote-real-estate-review.use-case';
import {
  RealEstateCommandRepository,
  type VoteRealEstateReviewInput,
  type VoteRealEstateReviewOutput,
} from '@/modules/real-estates/domain';
import { VoteType } from '@/types/vote-type';

describe('createVoteRealEstateReviewUseCase', () => {
  let dependencies: RealEstateCommandoBase;
  let getCurrentUserId: Mock<() => Promise<string | null>>;
  let rateLimit: Mock<(key: string, action: string) => Promise<void>>;
  let voteReview: Mock<
    (input: VoteRealEstateReviewInput) => Promise<VoteRealEstateReviewOutput>
  >;

  const repository = (): RealEstateCommandRepository => ({
    create: vi.fn(),
    vote: vi.fn(),
    toggleFavorite: vi.fn(),
    createReview: vi.fn(),
    updateReview: vi.fn(),
    deleteReview: vi.fn(),
    voteReview: voteReview,
  });

  const validInput: VoteRealEstateReviewInput = {
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
      repository: repository(),
    };
  });

  it('throws UNAUTHORIZED when the user is missing', async () => {
    getCurrentUserId.mockResolvedValueOnce(null);
    const execute = createVoteRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow(
      'Debes iniciar sesión para realizar esta acción'
    );
    expect(rateLimit).not.toHaveBeenCalled();
  });

  it('applies the vote rate limit key', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    voteReview.mockResolvedValueOnce({});
    const execute = createVoteRealEstateReviewUseCase(dependencies);

    await execute(validInput);

    expect(rateLimit).toHaveBeenCalledWith('vote-re-review:user-123', 'vote');
  });

  it('delegates valid input to the repository and returns its result', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const repoResult = { success: true };
    voteReview.mockResolvedValueOnce(repoResult);
    const execute = createVoteRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual(repoResult);
    expect(voteReview).toHaveBeenCalledWith(validInput);
  });

  it('rejects invalid vote type before hitting the repository', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const execute = createVoteRealEstateReviewUseCase(dependencies);

    await expect(
      execute({
        reviewId: '550e8400-e29b-41d4-a716-446655440000',
        voteType: 'invalid_vote',
      })
    ).rejects.toThrow();

    expect(voteReview).not.toHaveBeenCalled();
  });

  it('propagates rate limit failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    rateLimit.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const execute = createVoteRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Rate limit exceeded');
    expect(voteReview).not.toHaveBeenCalled();
  });

  it('propagates repository failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    voteReview.mockRejectedValueOnce(new Error('Database error'));
    const execute = createVoteRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Database error');
  });
});
