import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { RealEstateCommandoBase } from '../interfaces';
import { createToggleFavoriteRealEstateUseCase } from '../toggle-favorite-real-estate.use-case';
import {
  RealEstateCommandRepository,
  type ToggleFavoriteRealEstateInput,
  type ToggleFavoriteRealEstateOutput,
} from '@/modules/real-estates/domain';

describe('createToggleFavoriteRealEstateUseCase', () => {
  let dependencies: RealEstateCommandoBase;
  let getCurrentUserId: Mock<() => Promise<string | null>>;
  let rateLimit: Mock<(key: string, action: string) => Promise<void>>;
  let toggleFavorite: Mock<
    (input: ToggleFavoriteRealEstateInput) => Promise<ToggleFavoriteRealEstateOutput>
  >;

  const repository = (): RealEstateCommandRepository => ({
    create: vi.fn(),
    vote: vi.fn(),
    toggleFavorite: toggleFavorite,
    createReview: vi.fn(),
    updateReview: vi.fn(),
    deleteReview: vi.fn(),
    voteReview: vi.fn(),
  });

  const validInput: ToggleFavoriteRealEstateInput = {
    realEstateId: '550e8400-e29b-41d4-a716-446655440000',
  };

  beforeEach(() => {
    getCurrentUserId = vi.fn();
    rateLimit = vi.fn().mockResolvedValue(undefined);
    toggleFavorite = vi.fn();

    dependencies = {
      getCurrentUserId,
      rateLimit,
      repository: repository(),
    };
  });

  it('throws UNAUTHORIZED when the user is missing', async () => {
    getCurrentUserId.mockResolvedValueOnce(null);
    const execute = createToggleFavoriteRealEstateUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow(
      'Debes iniciar sesión para realizar esta acción'
    );
    expect(rateLimit).not.toHaveBeenCalled();
  });

  it('applies the vote rate limit key', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    toggleFavorite.mockResolvedValueOnce({ success: true, message: 'favorited' });
    const execute = createToggleFavoriteRealEstateUseCase(dependencies);

    await execute(validInput);

    expect(rateLimit).toHaveBeenCalledWith('favorite-real-estate:user-123', 'vote');
  });

  it('delegates valid input to the repository and returns its result', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const repoResult = { success: true, message: 'ok', is_favorite: true };
    toggleFavorite.mockResolvedValueOnce(repoResult);
    const execute = createToggleFavoriteRealEstateUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual(repoResult);
    expect(toggleFavorite).toHaveBeenCalledWith(validInput);
  });

  it('rejects invalid UUIDs before hitting the repository', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const execute = createToggleFavoriteRealEstateUseCase(dependencies);

    await expect(execute({ realEstateId: 'not-a-uuid' })).rejects.toThrow();
    expect(toggleFavorite).not.toHaveBeenCalled();
  });

  it('propagates rate limit failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    rateLimit.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const execute = createToggleFavoriteRealEstateUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Rate limit exceeded');
  });

  it('propagates repository failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    toggleFavorite.mockRejectedValueOnce(new Error('Database error'));
    const execute = createToggleFavoriteRealEstateUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Database error');
  });
});
