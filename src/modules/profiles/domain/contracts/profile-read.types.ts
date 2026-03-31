import type { RealEstateWitheVotes, ReviewWithVotes } from '@/types';

export type GetCurrentUserReviewsOutput = ReviewWithVotes[] | null;

export type GetCurrentUserFavoriteReviewsOutput = ReviewWithVotes[];

export type GetCurrentUserFavoriteRealEstatesOutput = RealEstateWitheVotes[];
