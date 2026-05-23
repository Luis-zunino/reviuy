import { describe, expect, it, vi } from 'vitest';
import { createGetReviewsByRealEstateIdQuery } from '../get-reviews-by-real-estate-id.query';
import type { PropertyReviewReadRepository } from '../../../domain';

describe('createGetReviewsByRealEstateIdQuery', () => {
  it('delegates to repository', async () => {
    const expected = [{ id: 'review-1' }, { id: 'review-2' }];
    const input = { realEstateId: 're-123' };

    const repository: PropertyReviewReadRepository = {
      getByAddress: vi.fn(),
      getById: vi.fn(),
      getByRealEstateId: vi.fn().mockResolvedValue(expected),
      getByUserId: vi.fn(),
      searchByZone: vi.fn(),
      searchNearby: vi.fn(),
      getUserVote: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetReviewsByRealEstateIdQuery({
      propertyReviewReadRepository: repository,
    });

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.getByRealEstateId).toHaveBeenCalledWith(input);
  });

  it('returns empty array when no reviews exist', async () => {
    const input = { realEstateId: 're-empty' };

    const repository: PropertyReviewReadRepository = {
      getByAddress: vi.fn(),
      getById: vi.fn(),
      getByRealEstateId: vi.fn().mockResolvedValue([]),
      getByUserId: vi.fn(),
      searchByZone: vi.fn(),
      searchNearby: vi.fn(),
      getUserVote: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetReviewsByRealEstateIdQuery({
      propertyReviewReadRepository: repository,
    });

    await expect(handler(input)).resolves.toEqual([]);
  });
});
