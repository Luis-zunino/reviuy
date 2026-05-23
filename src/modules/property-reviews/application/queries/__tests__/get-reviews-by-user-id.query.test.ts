import { describe, expect, it, vi } from 'vitest';
import { createGetReviewsByUserIdQuery } from '../get-reviews-by-user-id.query';
import type { PropertyReviewReadRepository } from '../../../domain';

describe('createGetReviewsByUserIdQuery', () => {
  it('delegates to repository', async () => {
    const expected = [{ id: 'review-1' }, { id: 'review-2' }];

    const repository: PropertyReviewReadRepository = {
      getByAddress: vi.fn(),
      getById: vi.fn(),
      getByRealEstateId: vi.fn(),
      getByUserId: vi.fn().mockResolvedValue(expected),
      searchByZone: vi.fn(),
      searchNearby: vi.fn(),
      getUserVote: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetReviewsByUserIdQuery({ propertyReviewReadRepository: repository });

    await expect(handler()).resolves.toEqual(expected);
    expect(repository.getByUserId).toHaveBeenCalledTimes(1);
  });

  it('returns null when user has no reviews', async () => {
    const repository: PropertyReviewReadRepository = {
      getByAddress: vi.fn(),
      getById: vi.fn(),
      getByRealEstateId: vi.fn(),
      getByUserId: vi.fn().mockResolvedValue(null),
      searchByZone: vi.fn(),
      searchNearby: vi.fn(),
      getUserVote: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetReviewsByUserIdQuery({ propertyReviewReadRepository: repository });

    await expect(handler()).resolves.toBeNull();
  });
});
