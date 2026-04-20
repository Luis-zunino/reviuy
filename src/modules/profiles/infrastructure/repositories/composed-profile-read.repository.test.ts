import { describe, expect, it, vi } from 'vitest';
import { ComposedProfileReadRepository } from './composed-profile-read.repository';
import type { PropertyReviewReadRepository } from '@/modules/property-reviews';
import type { RealEstateReadRepository } from '@/modules/real-estates';

describe('ComposedProfileReadRepository', () => {
  it('delegates current user review reads to property reviews', async () => {
    const propertyReviewReadRepository = {
      getByUserId: vi.fn().mockResolvedValue([]),
      getUserFavorites: vi.fn(),
    } as unknown as PropertyReviewReadRepository;
    const realEstateReadRepository = {
      getUserFavorites: vi.fn(),
    } as unknown as RealEstateReadRepository;

    const repository = new ComposedProfileReadRepository({
      propertyReviewReadRepository,
      realEstateReadRepository,
    });

    await expect(repository.getCurrentUserReviews()).resolves.toEqual([]);
    expect(propertyReviewReadRepository.getByUserId).toHaveBeenCalledWith();
  });

  it('delegates favorite review reads to property reviews', async () => {
    const propertyReviewReadRepository = {
      getByUserId: vi.fn(),
      getUserFavorites: vi.fn().mockResolvedValue([]),
    } as unknown as PropertyReviewReadRepository;
    const realEstateReadRepository = {
      getUserFavorites: vi.fn(),
    } as unknown as RealEstateReadRepository;

    const repository = new ComposedProfileReadRepository({
      propertyReviewReadRepository,
      realEstateReadRepository,
    });

    await expect(repository.getCurrentUserFavoriteReviews()).resolves.toEqual([]);
    expect(propertyReviewReadRepository.getUserFavorites).toHaveBeenCalledWith({});
  });

  it('delegates favorite real estate reads to real estates', async () => {
    const propertyReviewReadRepository = {
      getByUserId: vi.fn(),
      getUserFavorites: vi.fn(),
    } as unknown as PropertyReviewReadRepository;
    const realEstateReadRepository = {
      getUserFavorites: vi.fn().mockResolvedValue([{ id: 'real-estate-1' }]),
    } as unknown as RealEstateReadRepository;

    const repository = new ComposedProfileReadRepository({
      propertyReviewReadRepository,
      realEstateReadRepository,
    });

    await expect(repository.getCurrentUserFavoriteRealEstates()).resolves.toEqual([
      { id: 'real-estate-1' },
    ]);
    expect(realEstateReadRepository.getUserFavorites).toHaveBeenCalledTimes(1);
  });
});
