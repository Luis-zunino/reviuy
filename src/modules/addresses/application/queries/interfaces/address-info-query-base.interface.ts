import { AddressReadRepository } from '@/modules/addresses/domain';

export interface AddressInfoQueryBase {
  repository: AddressReadRepository;
}
