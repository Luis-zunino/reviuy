import { describe, expect, it, vi } from 'vitest';
import { createGetRealEstateReviewByUserIdQuery } from '../get-real-estate-review-by-user-id.query';
import type { RealEstateReadRepository } from '@/modules/real-estates/domain';

describe('createGetRealEstateReviewByUserIdQuery', () => {
  it('delegates to repository', async () => {
    const expected = { id: 'review-123', rating: 4, comment: 'Good' };
    const input = { realEstateId: 're-123' };

    const repository: RealEstateReadRepository = {
      getReviewByUserId: vi.fn().mockResolvedValue(expected),
      getById: vi.fn(),
      getAllReviews: vi.fn(),
      getReviewById: vi.fn(),
      getUserVote: vi.fn(),
      getUserReviewVote: vi.fn(),
      search: vi.fn(),
      getRealEstatesWithVotesPaginated: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      hasUserReported: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetRealEstateReviewByUserIdQuery({ repository });

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.getReviewByUserId).toHaveBeenCalledWith(input);
  });
});
