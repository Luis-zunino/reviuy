import { describe, expect, it, vi } from 'vitest';
import { createGetUserRealEstateReviewVoteQuery } from '../get-user-real-estate-review-vote.query';
import { VoteType } from '@/types';
import type { RealEstateReadRepository } from '@/modules/real-estates/domain';

describe('createGetUserRealEstateReviewVoteQuery', () => {
  it('debe delegar al repositorio para obtener el voto del usuario en una reseña', async () => {
    const expected = VoteType.LIKE;
    const input = { reviewId: 'review-123' };

    const repository: RealEstateReadRepository = {
      getUserReviewVote: vi.fn().mockResolvedValue(expected),
      getById: vi.fn(),
      getAllReviews: vi.fn(),
      getReviewById: vi.fn(),
      getReviewByUserId: vi.fn(),
      getUserVote: vi.fn(),
      search: vi.fn(),
      getRealEstatesWithVotesPaginated: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      hasUserReported: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetUserRealEstateReviewVoteQuery({ repository });

    await expect(handler(input)).resolves.toBe(VoteType.LIKE);
    expect(repository.getUserReviewVote).toHaveBeenCalledWith(input);
  });

  it('debe retornar null cuando el usuario no ha votado la reseña', async () => {
    const input = { reviewId: 'review-456' };

    const repository: RealEstateReadRepository = {
      getUserReviewVote: vi.fn().mockResolvedValue(null),
      getById: vi.fn(),
      getAllReviews: vi.fn(),
      getReviewById: vi.fn(),
      getReviewByUserId: vi.fn(),
      getUserVote: vi.fn(),
      search: vi.fn(),
      getRealEstatesWithVotesPaginated: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      hasUserReported: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetUserRealEstateReviewVoteQuery({ repository });

    await expect(handler(input)).resolves.toBeNull();
  });
});
