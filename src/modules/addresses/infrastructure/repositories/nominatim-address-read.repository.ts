import { NOMINATIM_URL } from '@/constants';
import { searchAddressAction } from '@/app/_actions';
import type {
  AddressReadRepository,
  GetAddressInfoInput,
  GetAddressInfoOutput,
  SearchAddressByNameInput,
  SearchAddressByNameOutput,
} from '../../domain';

export class NominatimAddressReadRepository implements AddressReadRepository {
  async searchByName({
    query,
    countrycodes = 'uy',
    limit = 5,
  }: SearchAddressByNameInput): Promise<SearchAddressByNameOutput> {
    return searchAddressAction(query, countrycodes, limit);
  }

  async getAddressInfo({ osmId }: GetAddressInfoInput): Promise<GetAddressInfoOutput> {
    const response = await fetch(
      `${NOMINATIM_URL}/lookup?osm_ids=${osmId}&format=json&extratags=1`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json() as Promise<GetAddressInfoOutput>;
  }
}
