import { describe, expect, it, vi } from 'vitest';
import { createGetReviewsByZoneQuery } from '../get-reviews-by-zone.query';
import type { PropertyReviewReadRepository } from '../../../domain';

describe('createGetReviewsByZoneQuery', () => {
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
    repository.searchByZone = vi.fn().mockResolvedValue(expected);
    const handler = createGetReviewsByZoneQuery({ propertyReviewReadRepository: repository });
    const input = { query: 'Centro', limit: 20 };

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.searchByZone).toHaveBeenCalledWith(input);
  });

  it('throws VALIDATION_ERROR for empty query', async () => {
    const handler = createGetReviewsByZoneQuery({ propertyReviewReadRepository: repository });
    repository.searchByZone = vi.fn();

    await expect(handler({ query: '' })).rejects.toThrow('query:');
    expect(repository.searchByZone).not.toHaveBeenCalled();
  });

  it('works without optional limit', async () => {
    repository.searchByZone = vi.fn().mockResolvedValue(expected);
    const handler = createGetReviewsByZoneQuery({ propertyReviewReadRepository: repository });
    const input = { query: 'Centro' };

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.searchByZone).toHaveBeenCalledWith(input);
  });
});
