import { describe, expect, it, vi } from 'vitest';
import { createHasUserReportedReviewQuery } from '../has-user-reported-review.query';
import type { PropertyReviewReadRepository } from '../../../domain';

describe('createHasUserReportedReviewQuery', () => {
  it('returns true when user has reported the review', async () => {
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
      isFavorite: vi.fn(),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn().mockResolvedValue(true),
    };

    const handler = createHasUserReportedReviewQuery({ propertyReviewReadRepository: repository });

    await expect(handler(input)).resolves.toBe(true);
    expect(repository.hasUserReportedReview).toHaveBeenCalledWith(input);
  });

  it('returns false when user has not reported the review', async () => {
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
      isFavorite: vi.fn(),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn().mockResolvedValue(false),
    };

    const handler = createHasUserReportedReviewQuery({ propertyReviewReadRepository: repository });

    await expect(handler(input)).resolves.toBe(false);
  });
});
