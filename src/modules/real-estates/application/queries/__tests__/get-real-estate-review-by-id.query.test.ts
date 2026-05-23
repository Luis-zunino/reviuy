import { describe, expect, it, vi } from 'vitest';
import { createGetRealEstateReviewByIdQuery } from '../get-real-estate-review-by-id.query';
import type { RealEstateReadRepository } from '@/modules/real-estates/domain';

describe('createGetRealEstateReviewByIdQuery', () => {
  it('delegates to repository', async () => {
    const expected = { id: 'review-123', rating: 5, comment: 'Great!' };
    const input = { reviewId: 'review-123' };

    const repository: RealEstateReadRepository = {
      getReviewById: vi.fn().mockResolvedValue(expected),
      getById: vi.fn(),
      getAllReviews: vi.fn(),
      getReviewByUserId: vi.fn(),
      getUserVote: vi.fn(),
      getUserReviewVote: vi.fn(),
      search: vi.fn(),
      getRealEstatesWithVotesPaginated: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      hasUserReported: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetRealEstateReviewByIdQuery({ repository });

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.getReviewById).toHaveBeenCalledWith(input);
  });
});
