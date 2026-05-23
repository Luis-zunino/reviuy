import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { RealEstateCommandoBase } from '../interfaces';
import { createCreateRealEstateReviewUseCase } from '../create-real-estate-review.use-case';
import {
  RealEstateCommandRepository,
  type CreateRealEstateReviewInput,
  type CreateRealEstateReviewOutput,
} from '@/modules/real-estates/domain';

describe('createCreateRealEstateReviewUseCase', () => {
  let dependencies: RealEstateCommandoBase;
  let getCurrentUserId: Mock<() => Promise<string | null>>;
  let rateLimit: Mock<(key: string, action: string) => Promise<void>>;
  let createReview: Mock<
    (input: CreateRealEstateReviewInput) => Promise<CreateRealEstateReviewOutput>
  >;

  const repository = (): RealEstateCommandRepository => ({
    create: vi.fn(),
    vote: vi.fn(),
    toggleFavorite: vi.fn(),
    createReview: createReview,
    updateReview: vi.fn(),
    deleteReview: vi.fn(),
    voteReview: vi.fn(),
  });

  const validInput: CreateRealEstateReviewInput = {
    title: 'Great agency',
    description: 'Very professional staff',
    rating: 4,
    real_estate_id: '550e8400-e29b-41d4-a716-446655440000',
  };

  beforeEach(() => {
    getCurrentUserId = vi.fn();
    rateLimit = vi.fn().mockResolvedValue(undefined);
    createReview = vi.fn();

    dependencies = {
      getCurrentUserId,
      rateLimit,
      repository: repository(),
    };
  });

  it('throws UNAUTHORIZED when the user is missing', async () => {
    getCurrentUserId.mockResolvedValueOnce(null);
    const execute = createCreateRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow(
      'Debes iniciar sesión para realizar esta acción'
    );
    expect(rateLimit).not.toHaveBeenCalled();
  });

  it('applies the write rate limit key', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    createReview.mockResolvedValueOnce({ success: true, message: 'created' });
    const execute = createCreateRealEstateReviewUseCase(dependencies);

    await execute(validInput);

    expect(rateLimit).toHaveBeenCalledWith('create-re-review:user-123', 'write');
  });

  it('throws VALIDATION_ERROR for missing fields', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const execute = createCreateRealEstateReviewUseCase(dependencies);

    await expect(
      execute({
        title: 'Great agency',
        description: 'Very professional',
        rating: 4,
      })
    ).rejects.toThrow('real_estate_id:');

    expect(createReview).not.toHaveBeenCalled();
  });

  it('delegates valid input to the repository and returns its result', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const repositoryResult: CreateRealEstateReviewOutput = {
      success: true,
      message: 'Review created successfully',
    };
    createReview.mockResolvedValueOnce(repositoryResult);
    const execute = createCreateRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual(repositoryResult);
    expect(createReview).toHaveBeenCalledWith(validInput);
  });

  it('propagates repository failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    createReview.mockRejectedValueOnce(new Error('Database error'));
    const execute = createCreateRealEstateReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Database error');
  });
});
