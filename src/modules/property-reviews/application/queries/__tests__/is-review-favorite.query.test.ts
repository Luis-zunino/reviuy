import { describe, expect, it, vi } from 'vitest';
import { createIsReviewFavoriteQuery } from '../is-review-favorite.query';
import type { PropertyReviewReadRepository } from '../../../domain';

describe('createIsReviewFavoriteQuery', () => {
  it('returns true when review is favorite', async () => {
    const input = { reviewId: 'review-123' };

    const repository: PropertyReviewReadRepository = {
      getByAddress: vi.fn(),
      getById: vi.fn(),
      getByRealEstateId: vi.fn(),
      getByUserId: vi.fn(),
      searchByZone: vi.fn(),
      searchNearby: vi.fn(),
      getUserVote: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn().mockResolvedValue(true),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createIsReviewFavoriteQuery({ propertyReviewReadRepository: repository });

    await expect(handler(input)).resolves.toBe(true);
    expect(repository.isFavorite).toHaveBeenCalledWith(input);
  });

  it('returns false when review is not favorite', async () => {
    const input = { reviewId: 'review-456' };

    const repository: PropertyReviewReadRepository = {
      getByAddress: vi.fn(),
      getById: vi.fn(),
      getByRealEstateId: vi.fn(),
      getByUserId: vi.fn(),
      searchByZone: vi.fn(),
      searchNearby: vi.fn(),
      getUserVote: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn().mockResolvedValue(false),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createIsReviewFavoriteQuery({ propertyReviewReadRepository: repository });

    await expect(handler(input)).resolves.toBe(false);
  });
});
