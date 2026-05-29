import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

// Mock server-only to prevent resolution errors in Vitest environment
vi.mock('server-only', () => ({}));

// Mock next/font/google as it's not meant to run in a test environment
vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mock-inter-class',
    style: {
      fontFamily: 'mock-inter',
    },
  }),
}));

// Mock presentation layers to prevent module-level side effects in hooks
vi.mock('@/modules/property-reviews/presentation', () => ({}));
vi.mock('@/modules/profiles/presentation', () => ({}));
vi.mock('@/modules/real-estates', () => ({
  SupabaseRealEstateReadRepository: vi.fn(),
}));

// Mock @supabase/ssr to prevent actual client initialization in tests
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({ data: { user: { id: 'mock-user-id' } }, error: null })
      ),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
      })),
    })),
  })),
}));

import {
  createUpdatePropertyReviewUseCase,
  PropertyReviewCommandRepository,
  UpdatePropertyReviewDependencies,
  UpdatePropertyReviewInput,
  UpdatePropertyReviewResult,
} from '@/modules/property-reviews';

describe('createUpdatePropertyReviewUseCase', () => {
  let dependencies: UpdatePropertyReviewDependencies;
  let getCurrentUserId: Mock<() => Promise<string | null>>;
  let rateLimit: Mock<(key: string, action: string) => Promise<void>>;
  let updateReview: Mock<(input: UpdatePropertyReviewInput) => Promise<UpdatePropertyReviewResult>>;

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
