import { describe, expect, it, vi } from 'vitest';
import { createGetReviewByIdQuery } from '../get-review-by-id.query';
import type { PropertyReviewReadRepository } from '../../../domain';

describe('createGetReviewByIdQuery', () => {
  it('delegates to repository', async () => {
    const expected = { id: 'review-123', title: 'Test', description: 'Desc' };
    const input = { reviewId: 'review-123' };

    const repository: PropertyReviewReadRepository = {
      getByAddress: vi.fn(),
      getById: vi.fn().mockResolvedValue(expected),
      getByRealEstateId: vi.fn(),
      getByUserId: vi.fn(),
      searchByZone: vi.fn(),
      searchNearby: vi.fn(),
      getUserVote: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetReviewByIdQuery({ propertyReviewReadRepository: repository });

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.getById).toHaveBeenCalledWith(input);
  });

  it('returns null when review is not found', async () => {
    const input = { reviewId: 'non-existent' };

    const repository: PropertyReviewReadRepository = {
      getByAddress: vi.fn(),
      getById: vi.fn().mockResolvedValue(null),
      getByRealEstateId: vi.fn(),
      getByUserId: vi.fn(),
      searchByZone: vi.fn(),
      searchNearby: vi.fn(),
      getUserVote: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetReviewByIdQuery({ propertyReviewReadRepository: repository });

    await expect(handler(input)).resolves.toBeNull();
  });
});
