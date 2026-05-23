import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { RealEstateCommandoBase } from '../interfaces';
import { createDeleteRealEstateReviewUseCase } from '../delete-real-estate-review.use-case';
import {
  RealEstateCommandRepository,
  type DeleteRealEstateReviewInput,
  type DeleteRealEstateReviewOutput,
} from '@/modules/real-estates/domain';

describe('createDeleteRealEstateReviewUseCase', () => {
  let dependencies: RealEstateCommandoBase;
  let getCurrentUserId: Mock<() => Promise<string | null>>;
  let rateLimit: Mock<(key: string, action: string) => Promise<void>>;
  let deleteReview: Mock<
    (input: DeleteRealEstateReviewInput) => Promise<DeleteRealEstateReviewOutput>
  >;

  const repository = (): RealEstateCommandRepository => ({
    create: vi.fn(),
    vote: vi.fn(),
    toggleFavorite: vi.fn(),
    createReview: vi.fn(),
    updateReview: vi.fn(),
    deleteReview: deleteReview,
    voteReview: vi.fn(),
  });

  const validInput: DeleteRealEstateReviewInput = {
    reviewId: '550e8400-e29b-41d4-a716-446655440000',
  };

  beforeEach(() => {
    getCurrentUserId = vi.fn();
    rateLimit = vi.fn().mockResolvedValue(undefined);
    deleteReview = vi.fn();

    dependencies = {
      getCurrentUserId,
      rateLimit,
      repository: repository(),
    };
  });

  it('throws UNAUTHORIZED when the user is missing', async () => {
    getCurrentUserId.mockResolvedValueOnce(null);
    const execute = createDeleteRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow(
      'Debes iniciar sesión para realizar esta acción'
    );
    expect(rateLimit).not.toHaveBeenCalled();
  });

  it('applies the write rate limit key', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    deleteReview.mockResolvedValueOnce({ success: true, message: 'deleted' });
    const execute = createDeleteRealEstateReviewUseCase(dependencies);

    await execute(validInput);

    expect(rateLimit).toHaveBeenCalledWith('delete-re-review:user-123', 'write');
  });

  it('delegates valid input to the repository and returns its result', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const repositoryResult: DeleteRealEstateReviewOutput = {
      success: true,
      message: 'Review deleted successfully',
    };
    deleteReview.mockResolvedValueOnce(repositoryResult);
    const execute = createDeleteRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual(repositoryResult);
    expect(deleteReview).toHaveBeenCalledWith(validInput);
  });

  it('propagates rate limit failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    rateLimit.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const execute = createDeleteRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Rate limit exceeded');
    expect(deleteReview).not.toHaveBeenCalled();
  });

  it('propagates repository failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    deleteReview.mockRejectedValueOnce(new Error('Database error'));
    const execute = createDeleteRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Database error');
  });
});
