import { describe, expect, it, vi } from 'vitest';
import { createGetUserFavoriteReviewsQuery } from '../get-user-favorite-reviews.query';
import type { PropertyReviewReadRepository } from '../../../domain';

describe('createGetUserFavoriteReviewsQuery', () => {
  it('delegates to repository', async () => {
    const expected = [{ id: 'review-1' }, { id: 'review-2' }];

    const repository: PropertyReviewReadRepository = {
      getByAddress: vi.fn(),
      getById: vi.fn(),
      getByRealEstateId: vi.fn(),
      getByUserId: vi.fn(),
      searchByZone: vi.fn(),
      searchNearby: vi.fn(),
      getUserVote: vi.fn(),
      getUserFavorites: vi.fn().mockResolvedValue(expected),
      isFavorite: vi.fn(),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetUserFavoriteReviewsQuery({ propertyReviewReadRepository: repository });

    await expect(handler()).resolves.toEqual(expected);
    expect(repository.getUserFavorites).toHaveBeenCalledTimes(1);
  });

  it('returns empty array when no favorites exist', async () => {
    const repository: PropertyReviewReadRepository = {
      getByAddress: vi.fn(),
      getById: vi.fn(),
      getByRealEstateId: vi.fn(),
      getByUserId: vi.fn(),
      searchByZone: vi.fn(),
      searchNearby: vi.fn(),
      getUserVote: vi.fn(),
      getUserFavorites: vi.fn().mockResolvedValue([]),
      isFavorite: vi.fn(),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetUserFavoriteReviewsQuery({ propertyReviewReadRepository: repository });

    await expect(handler()).resolves.toEqual([]);
  });
});
