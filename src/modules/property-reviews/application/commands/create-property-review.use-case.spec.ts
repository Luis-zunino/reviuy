import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CreatePropertyReviewResult, PropertyReviewCommandRepository } from '../../domain';

vi.mock('@/lib', () => ({
  createError: (code: string, message?: string) => new Error(message ?? code),
  RateLimitType: {},
}));

import { createCreatePropertyReviewUseCase } from './create-property-review.use-case';
import type { CreatePropertyReviewUseCaseDependencies } from './create-property-review.use-case';

describe('createCreatePropertyReviewUseCase', () => {
  let dependencies: CreatePropertyReviewUseCaseDependencies;
  let getCurrentUserId: ReturnType<typeof vi.fn>;
  let rateLimit: ReturnType<typeof vi.fn>;
  let createReview: ReturnType<typeof vi.fn>;

  const repository = (): PropertyReviewCommandRepository => ({
    create: createReview,
    update: vi.fn(),
    delete: vi.fn(),
    vote: vi.fn(),
    toggleFavorite: vi.fn(),
  });

  const validInput = {
    data: {
      title: 'Apartamento muy comodo',
      description: 'El lugar estaba limpio, bien ubicado y fue una buena experiencia.',
      rating: 4,
      address_osm_id: '123456789',
      address_text: '18 de Julio 1234, Montevideo',
      latitude: -34.9011,
      longitude: -56.1645,
      property_type: 'apartment',
      zone_rating: 4,
      winter_comfort: 'comfortable',
      summer_comfort: 'comfortable',
      humidity: 'moderate',
      real_estate_experience: 'Buena atencion en general.',
      apartment_number: '304',
      review_rooms: [{ room_type: 'bedroom', area_m2: 15 }],
    },
  };

  beforeEach(() => {
    getCurrentUserId = vi.fn();
    rateLimit = vi.fn().mockResolvedValue(undefined);
    createReview = vi.fn();

    dependencies = {
      getCurrentUserId,
      rateLimit,
      propertyReviewCommandRepository: repository(),
    };
  });

  it('throws UNAUTHORIZED when there is no user', async () => {
    getCurrentUserId.mockResolvedValueOnce(null);
    const execute = createCreatePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('UNAUTHORIZED');
    expect(rateLimit).not.toHaveBeenCalled();
    expect(createReview).not.toHaveBeenCalled();
  });

  it('applies rate limiting with the expected key', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    createReview.mockResolvedValueOnce({ success: true, message: 'created' });
    const execute = createCreatePropertyReviewUseCase(dependencies);

    await execute(validInput);

    expect(rateLimit).toHaveBeenCalledWith('create-review:user-123', 'write');
  });

  it('unwraps OpenAPI style input before delegating to the repository', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    createReview.mockResolvedValueOnce({ success: true, message: 'created' });
    const execute = createCreatePropertyReviewUseCase(dependencies);

    await execute(validInput);

    expect(createReview).toHaveBeenCalledWith(
      expect.objectContaining({
        title: validInput.data.title,
        description: validInput.data.description,
        rating: validInput.data.rating,
        address_osm_id: validInput.data.address_osm_id,
      })
    );
  });

  it('also accepts already unwrapped input', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    createReview.mockResolvedValueOnce({ success: true, message: 'created' });
    const execute = createCreatePropertyReviewUseCase(dependencies);

    const result = await execute(validInput.data);

    expect(result).toEqual({ success: true, message: 'created' });
  });

  it('throws VALIDATION_ERROR for invalid payloads', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const execute = createCreatePropertyReviewUseCase(dependencies);

    await expect(
      execute({
        data: {
          ...validInput.data,
          title: 'corto',
        },
      })
    ).rejects.toThrow('title:');

    expect(createReview).not.toHaveBeenCalled();
  });

  it('propagates repository errors', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    createReview.mockRejectedValueOnce(new Error('Database error'));
    const execute = createCreatePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Database error');
  });

  it('returns the repository result as-is', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const repositoryResult: CreatePropertyReviewResult = {
      success: true,
      message: 'Review created successfully',
      data: { id: 'review-1' } as CreatePropertyReviewResult['data'],
    };
    createReview.mockResolvedValueOnce(repositoryResult);
    const execute = createCreatePropertyReviewUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual(repositoryResult);
  });
});
