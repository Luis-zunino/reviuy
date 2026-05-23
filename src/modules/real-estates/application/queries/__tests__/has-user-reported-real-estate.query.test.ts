import { describe, expect, it, vi } from 'vitest';
import { createHasUserReportedRealEstateQuery } from '../has-user-reported-real-estate.query';
import type { RealEstateReadRepository } from '@/modules/real-estates/domain';

describe('createHasUserReportedRealEstateQuery', () => {
  it('delegates to repository', async () => {
    const input = { realEstateId: 're-123' };

    const repository: RealEstateReadRepository = {
      hasUserReported: vi.fn().mockResolvedValue(true),
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
      hasUserReportedReview: vi.fn(),
    };

    const handler = createHasUserReportedRealEstateQuery({ repository });

    await expect(handler(input)).resolves.toBe(true);
    expect(repository.hasUserReported).toHaveBeenCalledWith(input);
  });
});
