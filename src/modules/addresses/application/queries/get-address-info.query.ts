import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetAddressInfoInput, GetAddressInfoOutput } from '../../domain';
import { AddressInfoQueryBase } from './interfaces';

export const createGetAddressInfoQuery = (
  dependencies: AddressInfoQueryBase
): QueryHandler<GetAddressInfoInput, GetAddressInfoOutput> => {
  const { repository } = dependencies;

  return async (input: GetAddressInfoInput): Promise<GetAddressInfoOutput> =>
    repository.getAddressInfo(input);
};
