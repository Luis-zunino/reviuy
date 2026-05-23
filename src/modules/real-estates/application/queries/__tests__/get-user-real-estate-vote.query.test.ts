import { describe, expect, it, vi } from 'vitest';
import { createGetUserRealEstateVoteQuery } from '../get-user-real-estate-vote.query';
import { VoteType } from '@/types/vote-type';
import type { RealEstateReadRepository } from '@/modules/real-estates/domain';

describe('createGetUserRealEstateVoteQuery', () => {
  it('delegates to repository', async () => {
    const expected = VoteType.LIKE;
    const input = { realEstateId: 're-123' };

    const repository: RealEstateReadRepository = {
      getUserVote: vi.fn().mockResolvedValue(expected),
      getById: vi.fn(),
      getAllReviews: vi.fn(),
      getReviewById: vi.fn(),
      getReviewByUserId: vi.fn(),
      getUserReviewVote: vi.fn(),
      search: vi.fn(),
      getRealEstatesWithVotesPaginated: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      hasUserReported: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetUserRealEstateVoteQuery({ repository });

    await expect(handler(input)).resolves.toBe(VoteType.LIKE);
    expect(repository.getUserVote).toHaveBeenCalledWith(input);
  });
});
