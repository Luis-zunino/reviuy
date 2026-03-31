import type {
  GetCurrentUserFavoriteRealEstatesOutput,
  GetCurrentUserFavoriteReviewsOutput,
  GetCurrentUserReviewsOutput,
  ProfileReadRepository,
} from '../../domain';
import type { PropertyReviewReadRepository } from '@/modules/property-reviews';
import type { RealEstateReadRepository } from '@/modules/real-estates';

export interface ComposedProfileReadRepositoryDependencies {
  propertyReviewReadRepository: PropertyReviewReadRepository;
  realEstateReadRepository: RealEstateReadRepository;
}

export class ComposedProfileReadRepository implements ProfileReadRepository {
  constructor(private readonly dependencies: ComposedProfileReadRepositoryDependencies) {}

  async getCurrentUserReviews(): Promise<GetCurrentUserReviewsOutput> {
    return this.dependencies.propertyReviewReadRepository.getByUserId({});
  }

  async getCurrentUserFavoriteReviews(): Promise<GetCurrentUserFavoriteReviewsOutput> {
    return this.dependencies.propertyReviewReadRepository.getUserFavorites({});
  }

  async getCurrentUserFavoriteRealEstates(): Promise<GetCurrentUserFavoriteRealEstatesOutput> {
    return this.dependencies.realEstateReadRepository.getUserFavorites();
  }
}
