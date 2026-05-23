import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { RealEstateCommandoBase } from '../interfaces';
import { createVoteRealEstateUseCase } from '../vote-real-estate.use-case';
import {
  RealEstateCommandRepository,
  type VoteRealEstateInput,
  type VoteRealEstateOutput,
} from '@/modules/real-estates/domain';
import { VoteType } from '@/types/vote-type';

describe('createVoteRealEstateUseCase', () => {
  let dependencies: RealEstateCommandoBase;
  let getCurrentUserId: Mock<() => Promise<string | null>>;
  let rateLimit: Mock<(key: string, action: string) => Promise<void>>;
  let vote: Mock<(input: VoteRealEstateInput) => Promise<VoteRealEstateOutput>>;

  const repository = (): RealEstateCommandRepository => ({
    create: vi.fn(),
    vote: vote,
    toggleFavorite: vi.fn(),
    createReview: vi.fn(),
    updateReview: vi.fn(),
    deleteReview: vi.fn(),
    voteReview: vi.fn(),
  });

  const validInput: VoteRealEstateInput = {
    realEstateId: '550e8400-e29b-41d4-a716-446655440000',
    voteType: VoteType.LIKE,
  };

  beforeEach(() => {
    getCurrentUserId = vi.fn();
    rateLimit = vi.fn().mockResolvedValue(undefined);
    vote = vi.fn();

    dependencies = {
      getCurrentUserId,
      rateLimit,
      repository: repository(),
    };
  });

  it('throws UNAUTHORIZED when the user is missing', async () => {
    getCurrentUserId.mockResolvedValueOnce(null);
    const execute = createVoteRealEstateUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow(
      'Debes iniciar sesión para realizar esta acción'
    );
    expect(rateLimit).not.toHaveBeenCalled();
  });

  it('applies the vote rate limit key', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    vote.mockResolvedValueOnce({});
    const execute = createVoteRealEstateUseCase(dependencies);

    await execute(validInput);

    expect(rateLimit).toHaveBeenCalledWith('vote-real-estate:user-123', 'vote');
  });

  it('delegates valid input to the repository and returns its result', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const repoResult = { success: true };
    vote.mockResolvedValueOnce(repoResult);
    const execute = createVoteRealEstateUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual(repoResult);
    expect(vote).toHaveBeenCalledWith(validInput);
  });

  it('rejects invalid vote type before hitting the repository', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const execute = createVoteRealEstateUseCase(dependencies);

    await expect(
      execute({
        realEstateId: '550e8400-e29b-41d4-a716-446655440000',
        voteType: 'invalid_vote' as VoteType,
      })
    ).rejects.toThrow();

    expect(vote).not.toHaveBeenCalled();
  });

  it('propagates rate limit failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    rateLimit.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const execute = createVoteRealEstateUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Rate limit exceeded');
    expect(vote).not.toHaveBeenCalled();
  });

  it('propagates repository failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    vote.mockRejectedValueOnce(new Error('Database error'));
    const execute = createVoteRealEstateUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Database error');
  });
});
