import type { QueryHandler } from '@/shared/kernel/contracts';
import type { SearchAddressByNameInput, SearchAddressByNameOutput } from '../../domain';
import { AddressInfoQueryBase } from './interfaces';

export const createSearchAddressByNameQuery = (
  dependencies: AddressInfoQueryBase
): QueryHandler<SearchAddressByNameInput, SearchAddressByNameOutput> => {
  const { repository } = dependencies;

  return async (input: SearchAddressByNameInput): Promise<SearchAddressByNameOutput> => {
    return repository.searchByName(input);
  };
};
