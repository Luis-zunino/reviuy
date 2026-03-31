import type {
  GetAddressInfoInput,
  GetAddressInfoOutput,
  SearchAddressByNameInput,
  SearchAddressByNameOutput,
} from '../contracts/address.types';

export interface AddressReadRepository {
  searchByName(input: SearchAddressByNameInput): Promise<SearchAddressByNameOutput>;
  getAddressInfo(input: GetAddressInfoInput): Promise<GetAddressInfoOutput>;
}
