import { describe, expect, it, vi } from 'vitest';
import { createGetReviewsByAddressQuery } from '../get-reviews-by-address.query';
import type { PropertyReviewReadRepository } from '../../../domain';

describe('createGetReviewsByAddressQuery', () => {
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
    repository.getByAddress = vi.fn().mockResolvedValue(expected);
    const handler = createGetReviewsByAddressQuery({ propertyReviewReadRepository: repository });
    const input = { osmId: 'N944835340' };

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.getByAddress).toHaveBeenCalledWith(input);
  });

  it('throws VALIDATION_ERROR for empty osmId', async () => {
    const handler = createGetReviewsByAddressQuery({ propertyReviewReadRepository: repository });
    repository.getByAddress = vi.fn();

    await expect(handler({ osmId: '' })).rejects.toThrow('osmId:');
    expect(repository.getByAddress).not.toHaveBeenCalled();
  });
});
