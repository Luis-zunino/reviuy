import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PropertyReviewCommandRepository } from '../../domain';
import { createUpdatePropertyReviewUseCase } from './update-property-review.use-case';
import type { UpdatePropertyReviewDependencies } from './update-property-review.use-case';

describe('createUpdatePropertyReviewUseCase', () => {
  let dependencies: UpdatePropertyReviewDependencies;
  let getCurrentUserId: ReturnType<typeof vi.fn>;
  let rateLimit: ReturnType<typeof vi.fn>;
  let updateReview: ReturnType<typeof vi.fn>;

  const repository = (): PropertyReviewCommandRepository => ({
    create: vi.fn(),
    update: updateReview,
    delete: vi.fn(),
    vote: vi.fn(),
    toggleFavorite: vi.fn(),
  });

  const reviewId = '550e8400-e29b-41d4-a716-446655440000';
  const validInput = {
    reviewId,
    title: 'Titulo actualizado',
    description: 'Descripcion suficientemente larga para pasar la validacion.',
    rating: 4,
    property_type: 'apartment',
  };

  beforeEach(() => {
    getCurrentUserId = vi.fn();
    rateLimit = vi.fn().mockResolvedValue(undefined);
    updateReview = vi.fn();

    dependencies = {
      getCurrentUserId,
      rateLimit,
      propertyReviewCommandRepository: repository(),
    };
  });

  it('returns UNAUTHORIZED when the user is missing', async () => {
    getCurrentUserId.mockResolvedValueOnce(null);
    const execute = createUpdatePropertyReviewUseCase(dependencies);

    await expect(execute({ reviewId, title: 'Titulo actualizado' })).resolves.toEqual({
      success: false,
      message: 'No autorizado',
      error: 'UNAUTHORIZED',
    });
  });

  it('applies rate limiting with the expected key', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    updateReview.mockResolvedValueOnce({ success: true, message: 'updated' });
    const execute = createUpdatePropertyReviewUseCase(dependencies);

    await execute(validInput);

    expect(rateLimit).toHaveBeenCalledWith('update-review:user-123', 'write');
  });

  it('delegates valid partial updates to the repository', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const repositoryResult = { success: true, message: 'Review updated successfully' };
    updateReview.mockResolvedValueOnce(repositoryResult);
    const execute = createUpdatePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual(repositoryResult);
    expect(updateReview).toHaveBeenCalledWith(validInput);
  });

  it('returns VALIDATION_ERROR when the payload is invalid', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const execute = createUpdatePropertyReviewUseCase(dependencies);

    await expect(
      execute({
        reviewId,
        rating: 0,
      })
    ).resolves.toEqual({
      success: false,
      message: 'Datos inválidos',
      error: 'VALIDATION_ERROR',
    });

    expect(updateReview).not.toHaveBeenCalled();
  });

  it('propagates rate limit failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    rateLimit.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const execute = createUpdatePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Rate limit exceeded');
  });

  it('propagates repository failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    updateReview.mockRejectedValueOnce(new Error('Database error'));
    const execute = createUpdatePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Database error');
  });
});
