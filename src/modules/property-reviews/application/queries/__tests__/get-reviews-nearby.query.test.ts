import { describe, expect, it, vi } from 'vitest';
import { createGetReviewsNearbyQuery } from '../get-reviews-nearby.query';
import type { PropertyReviewReadRepository } from '../../../domain';

describe('createGetReviewsNearbyQuery', () => {
  const expected = [{ id: 'review-1', title: 'Test' }];

  const repository: PropertyReviewReadRepository = {
    getByAddress: vi.fn(),
    getById: vi.fn(),
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

  it('validates input and delegates to repository', async () => {
    repository.searchNearby = vi.fn().mockResolvedValue(expected);
    const handler = createGetReviewsNearbyQuery({ propertyReviewReadRepository: repository });
    const input = { lat: -34.9011, lon: -56.1645 };

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.searchNearby).toHaveBeenCalledWith(input);
  });

  it('throws VALIDATION_ERROR for invalid lat', async () => {
    const handler = createGetReviewsNearbyQuery({ propertyReviewReadRepository: repository });
    repository.searchNearby = vi.fn();

    await expect(handler({ lat: 91, lon: 0 })).rejects.toThrow('lat:');
    expect(repository.searchNearby).not.toHaveBeenCalled();
  });

  it('throws VALIDATION_ERROR for invalid lon', async () => {
    const handler = createGetReviewsNearbyQuery({ propertyReviewReadRepository: repository });
    repository.searchNearby = vi.fn();

    await expect(handler({ lat: 0, lon: 181 })).rejects.toThrow('lon:');
    expect(repository.searchNearby).not.toHaveBeenCalled();
  });

  it('works with optional radiusDeg and limit', async () => {
    repository.searchNearby = vi.fn().mockResolvedValue(expected);
    const handler = createGetReviewsNearbyQuery({ propertyReviewReadRepository: repository });
    const input = { lat: -34.9011, lon: -56.1645, radiusDeg: 0.05, limit: 10 };

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.searchNearby).toHaveBeenCalledWith(input);
  });
});
