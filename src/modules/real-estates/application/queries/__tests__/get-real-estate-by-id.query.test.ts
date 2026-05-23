import { describe, expect, it, vi } from 'vitest';
import { createGetRealEstateByIdQuery } from '../get-real-estate-by-id.query';
import type { RealEstateReadRepository } from '@/modules/real-estates/domain';

describe('createGetRealEstateByIdQuery', () => {
  it('delegates to repository', async () => {
    const expected = { id: 're-123', name: 'Test Agency' };
    const input = { realEstateId: 're-123' };

    const repository: RealEstateReadRepository = {
      getById: vi.fn().mockResolvedValue(expected),
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
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetRealEstateByIdQuery({ repository });

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.getById).toHaveBeenCalledWith(input);
  });
});
