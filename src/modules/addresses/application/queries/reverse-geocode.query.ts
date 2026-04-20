import type { QueryHandler } from '@/shared/kernel/contracts';
import type { ReverseGeocodeInput, ReverseGeocodeOutput } from '../../domain';
import { AddressInfoQueryBase } from './interfaces';

export const createReverseGeocodeQuery = (
  dependencies: AddressInfoQueryBase
): QueryHandler<ReverseGeocodeInput, ReverseGeocodeOutput> => {
  const { repository } = dependencies;

  return async (input: ReverseGeocodeInput): Promise<ReverseGeocodeOutput> =>
    repository.reverseGeocode(input);
};
