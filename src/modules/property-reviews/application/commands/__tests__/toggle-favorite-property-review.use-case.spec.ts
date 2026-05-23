import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

vi.mock('server-only', () => ({}));

import type {
  PropertyReviewCommandRepository,
  ToggleFavoritePropertyReviewInput,
  ToggleFavoritePropertyReviewResult,
} from '../../../domain';
import { createToggleFavoritePropertyReviewUseCase } from '../toggle-favorite-property-review.use-case';
import type { ToggleFavoritePropertyReviewDependencies } from '../toggle-favorite-property-review.use-case';

describe('createToggleFavoritePropertyReviewUseCase', () => {
  let dependencies: ToggleFavoritePropertyReviewDependencies;
  let getCurrentUserId: Mock<() => Promise<string | null>>;
  let rateLimit: Mock<(key: string, action: string) => Promise<void>>;
  let toggleFavorite: Mock<
    (input: ToggleFavoritePropertyReviewInput) => Promise<ToggleFavoritePropertyReviewResult>
  >;

  const repository = (): PropertyReviewCommandRepository => ({
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    vote: vi.fn(),
    toggleFavorite: toggleFavorite,
  });

  const validInput = { reviewId: '550e8400-e29b-41d4-a716-446655440000' };

  beforeEach(() => {
    getCurrentUserId = vi.fn();
    rateLimit = vi.fn().mockResolvedValue(undefined);
    toggleFavorite = vi.fn();

    dependencies = {
      getCurrentUserId,
      rateLimit,
      propertyReviewCommandRepository: repository(),
    };
  });

  it('returns UNAUTHORIZED when the user is missing', async () => {
    getCurrentUserId.mockResolvedValueOnce(null);
    const execute = createToggleFavoritePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual({
      success: false,
      message: 'No autorizado',
      error: 'UNAUTHORIZED',
    });
  });

  it('applies the vote rate limit key', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    toggleFavorite.mockResolvedValueOnce({ success: true, message: 'favorited' });
    const execute = createToggleFavoritePropertyReviewUseCase(dependencies);

    await execute(validInput);

    expect(rateLimit).toHaveBeenCalledWith('favorite-review:user-123', 'vote');
  });

  it('delegates valid input to the repository and returns its result', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const result = { success: true, message: 'Toggled successfully', favorited: true };
    toggleFavorite.mockResolvedValueOnce(result);
    const execute = createToggleFavoritePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual(result);
    expect(toggleFavorite).toHaveBeenCalledWith(validInput);
  });

  it('rejects invalid UUIDs before hitting the repository', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const execute = createToggleFavoritePropertyReviewUseCase(dependencies);

    await expect(execute({ reviewId: 'not-a-uuid' })).rejects.toThrow();

    expect(toggleFavorite).not.toHaveBeenCalled();
  });

  it('propagates rate limit failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    rateLimit.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const execute = createToggleFavoritePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Rate limit exceeded');
  });

  it('propagates repository failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    toggleFavorite.mockRejectedValueOnce(new Error('Database error'));
    const execute = createToggleFavoritePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Database error');
  });
});
