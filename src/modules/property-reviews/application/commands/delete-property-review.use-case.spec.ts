import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PropertyReviewCommandRepository } from '../../domain';
import { createDeletePropertyReviewUseCase } from './delete-property-review.use-case';
import type { DeletePropertyReviewDependencies } from './delete-property-review.use-case';

describe('createDeletePropertyReviewUseCase', () => {
  let dependencies: DeletePropertyReviewDependencies;
  let getCurrentUserId: ReturnType<typeof vi.fn>;
  let rateLimit: ReturnType<typeof vi.fn>;
  let deleteReview: ReturnType<typeof vi.fn>;

  const repository = (): PropertyReviewCommandRepository => ({
    create: vi.fn(),
    update: vi.fn(),
    delete: deleteReview,
    vote: vi.fn(),
    toggleFavorite: vi.fn(),
  });

  const validInput = { reviewId: '550e8400-e29b-41d4-a716-446655440000' };

  beforeEach(() => {
    getCurrentUserId = vi.fn();
    rateLimit = vi.fn().mockResolvedValue(undefined);
    deleteReview = vi.fn();

    dependencies = {
      getCurrentUserId,
      rateLimit,
      propertyReviewCommandRepository: repository(),
    };
  });

  it('returns UNAUTHORIZED when there is no authenticated user', async () => {
    getCurrentUserId.mockResolvedValueOnce(null);
    const execute = createDeletePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual({
      success: false,
      message: 'No autorizado',
      error: 'UNAUTHORIZED',
    });
  });

  it('applies the write rate limit key', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    deleteReview.mockResolvedValueOnce({ success: true, message: 'deleted' });
    const execute = createDeletePropertyReviewUseCase(dependencies);

    await execute(validInput);

    expect(rateLimit).toHaveBeenCalledWith('delete-review:user-123', 'write');
  });

  it('delegates to the repository and returns its result', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const repositoryResult = { success: true, message: 'Review deleted successfully' };
    deleteReview.mockResolvedValueOnce(repositoryResult);
    const execute = createDeletePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual(repositoryResult);
    expect(deleteReview).toHaveBeenCalledWith(validInput);
  });

  it('propagates rate limit failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    rateLimit.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const execute = createDeletePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Rate limit exceeded');
    expect(deleteReview).not.toHaveBeenCalled();
  });

  it('propagates repository failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    deleteReview.mockRejectedValueOnce(new Error('Database connection error'));
    const execute = createDeletePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Database connection error');
  });
});
