import { describe, expect, it, vi } from 'vitest';
import { createCheckUserReviewForAddressQuery } from '../check-user-review-for-address.query';
import type { PropertyReviewReadRepository } from '../../../domain';

describe('createCheckUserReviewForAddressQuery', () => {
  it('returns review id when user has reviewed the address', async () => {
    const expected = { id: 'review-123' };
    const input = { osmId: 'N944835340' };

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
      checkUserReviewForAddress: vi.fn().mockResolvedValue(expected),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createCheckUserReviewForAddressQuery({
      propertyReviewReadRepository: repository,
    });

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.checkUserReviewForAddress).toHaveBeenCalledWith(input);
  });

  it('returns null when user has not reviewed the address', async () => {
    const input = { osmId: 'N944835341' };

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
      checkUserReviewForAddress: vi.fn().mockResolvedValue(null),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createCheckUserReviewForAddressQuery({
      propertyReviewReadRepository: repository,
    });

    await expect(handler(input)).resolves.toBeNull();
  });
});
