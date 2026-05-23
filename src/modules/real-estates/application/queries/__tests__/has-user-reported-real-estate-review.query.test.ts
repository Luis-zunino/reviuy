import { describe, expect, it, vi } from 'vitest';
import { createHasUserReportedRealEstateReviewQuery } from '../has-user-reported-real-estate-review.query';
import type { RealEstateReadRepository } from '@/modules/real-estates/domain';

describe('createHasUserReportedRealEstateReviewQuery', () => {
  it('delegates to repository', async () => {
    const input = { reviewId: 'review-123' };

    const repository: RealEstateReadRepository = {
      hasUserReportedReview: vi.fn().mockResolvedValue(true),
      getById: vi.fn(),
      getAllReviews: vi.fn(),
      getReviewById: vi.fn(),
      getReviewByUserId: vi.fn(),
      getUserVote: vi.fn(),
      getUserReviewVote: vi.fn(),
      search: vi.fn(),
      getRealEstatesWithVotesPaginated: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      hasUserReported: vi.fn(),
    };

    const handler = createHasUserReportedRealEstateReviewQuery({ repository });

    await expect(handler(input)).resolves.toBe(true);
    expect(repository.hasUserReportedReview).toHaveBeenCalledWith(input);
  });
});
