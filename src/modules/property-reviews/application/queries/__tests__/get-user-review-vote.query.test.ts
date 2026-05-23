import { describe, expect, it, vi } from 'vitest';
import { createGetUserReviewVoteQuery } from '../get-user-review-vote.query';
import { VoteType } from '@/types/vote-type';
import type { PropertyReviewReadRepository } from '../../../domain';

describe('createGetUserReviewVoteQuery', () => {
  it('returns the user vote for a review', async () => {
    const expected = VoteType.LIKE;
    const input = { reviewId: 'review-123' };

    const repository: PropertyReviewReadRepository = {
      getByAddress: vi.fn(),
      getById: vi.fn(),
      getByRealEstateId: vi.fn(),
      getByUserId: vi.fn(),
      searchByZone: vi.fn(),
      searchNearby: vi.fn(),
      getUserVote: vi.fn().mockResolvedValue(expected),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetUserReviewVoteQuery({ propertyReviewReadRepository: repository });

    await expect(handler(input)).resolves.toBe(VoteType.LIKE);
    expect(repository.getUserVote).toHaveBeenCalledWith(input);
  });

  it('returns null when user has not voted', async () => {
    const input = { reviewId: 'review-456' };

    const repository: PropertyReviewReadRepository = {
      getByAddress: vi.fn(),
      getById: vi.fn(),
      getByRealEstateId: vi.fn(),
      getByUserId: vi.fn(),
      searchByZone: vi.fn(),
      searchNearby: vi.fn(),
      getUserVote: vi.fn().mockResolvedValue(null),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      checkUserReviewForAddress: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetUserReviewVoteQuery({ propertyReviewReadRepository: repository });

    await expect(handler(input)).resolves.toBeNull();
  });
});
