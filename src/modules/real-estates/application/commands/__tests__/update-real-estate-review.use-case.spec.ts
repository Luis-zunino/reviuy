import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { RealEstateCommandoBase } from '../interfaces';
import { createUpdateRealEstateReviewUseCase } from '../update-real-estate-review.use-case';
import {
  RealEstateCommandRepository,
  type UpdateRealEstateReviewInput,
  type UpdateRealEstateReviewOutput,
} from '@/modules/real-estates/domain';

describe('createUpdateRealEstateReviewUseCase', () => {
  let dependencies: RealEstateCommandoBase;
  let getCurrentUserId: Mock<() => Promise<string | null>>;
  let rateLimit: Mock<(key: string, action: string) => Promise<void>>;
  let updateReview: Mock<
    (input: UpdateRealEstateReviewInput) => Promise<UpdateRealEstateReviewOutput>
  >;

  const repository = (): RealEstateCommandRepository => ({
    create: vi.fn(),
    vote: vi.fn(),
    toggleFavorite: vi.fn(),
    createReview: vi.fn(),
    updateReview: updateReview,
    deleteReview: vi.fn(),
    voteReview: vi.fn(),
  });

  const validInput: UpdateRealEstateReviewInput = {
    reviewId: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Updated title',
    description: 'Updated description',
    rating: 4,
  };

  beforeEach(() => {
    getCurrentUserId = vi.fn();
    rateLimit = vi.fn().mockResolvedValue(undefined);
    updateReview = vi.fn();

    dependencies = {
      getCurrentUserId,
      rateLimit,
      repository: repository(),
    };
  });

  it('throws UNAUTHORIZED when the user is missing', async () => {
    getCurrentUserId.mockResolvedValueOnce(null);
    const execute = createUpdateRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow(
      'Debes iniciar sesión para realizar esta acción'
    );
    expect(rateLimit).not.toHaveBeenCalled();
  });

  it('applies the write rate limit key', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    updateReview.mockResolvedValueOnce({ success: true, message: 'updated' });
    const execute = createUpdateRealEstateReviewUseCase(dependencies);

    await execute(validInput);

    expect(rateLimit).toHaveBeenCalledWith('update-re-review:user-123', 'write');
  });

  it('throws VALIDATION_ERROR for invalid field values', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const execute = createUpdateRealEstateReviewUseCase(dependencies);

    await expect(
      execute({
        reviewId: '550e8400-e29b-41d4-a716-446655440000',
        rating: 10,
      })
    ).rejects.toThrow('rating:');

    expect(updateReview).not.toHaveBeenCalled();
  });

  it('delegates valid input to the repository and returns its result', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const repositoryResult: UpdateRealEstateReviewOutput = {
      success: true,
      message: 'Review updated successfully',
    };
    updateReview.mockResolvedValueOnce(repositoryResult);
    const execute = createUpdateRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual(repositoryResult);
    expect(updateReview).toHaveBeenCalledWith(validInput);
  });

  it('propagates rate limit failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    rateLimit.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const execute = createUpdateRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Rate limit exceeded');
    expect(updateReview).not.toHaveBeenCalled();
  });

  it('propagates repository failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    updateReview.mockRejectedValueOnce(new Error('Database error'));
    const execute = createUpdateRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Database error');
  });
});
