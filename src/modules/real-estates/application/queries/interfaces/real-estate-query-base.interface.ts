import { RealEstateReadRepository } from '@/modules/real-estates/domain';

export interface RealEstateQueryBase {
  repository: RealEstateReadRepository;
}
