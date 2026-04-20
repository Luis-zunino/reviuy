import type {
  GetAddressInfoInput,
  GetAddressInfoOutput,
  SearchAddressByNameInput,
  SearchAddressByNameOutput,
  ReverseGeocodeInput,
  ReverseGeocodeOutput,
} from '../contracts/address.types';

export interface AddressReadRepository {
  searchByName(input: SearchAddressByNameInput): Promise<SearchAddressByNameOutput>;
  getAddressInfo(input: GetAddressInfoInput): Promise<GetAddressInfoOutput>;
  reverseGeocode(input: ReverseGeocodeInput): Promise<ReverseGeocodeOutput>;
}
