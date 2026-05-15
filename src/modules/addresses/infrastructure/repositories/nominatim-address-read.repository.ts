import { NOMINATIM_URL } from '@/constants';
import { createError } from '@/lib/errors';
import type {
  AddressReadRepository,
  GetAddressInfoInput,
  GetAddressInfoOutput,
  SearchAddressByNameInput,
  SearchAddressByNameOutput,
  ReverseGeocodeInput,
  ReverseGeocodeOutput,
} from '../../domain';

export class NominatimAddressReadRepository implements AddressReadRepository {
  async searchByName({
    query,
    countrycodes = 'uy',
    limit = 5,
  }: SearchAddressByNameInput): Promise<SearchAddressByNameOutput> {
    const url = new URL(`${NOMINATIM_URL}/search`);
    url.searchParams.set('format', 'json');
    url.searchParams.set('q', query);
    url.searchParams.set('countrycodes', countrycodes);
    url.searchParams.set('limit', String(limit));

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'ReviUy/1.0',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return [];
    }

    return response.json() as Promise<SearchAddressByNameOutput>;
  }

  async getAddressInfo({ osmId }: GetAddressInfoInput): Promise<GetAddressInfoOutput> {
    const response = await fetch(
      `${NOMINATIM_URL}/lookup?osm_ids=${osmId}&format=json&extratags=1`
    );

    if (!response.ok) {
      throw createError('INTERNAL_ERROR', 'Error consultando informacion de direccion');
    }

    return response.json() as Promise<GetAddressInfoOutput>;
  }

  async reverseGeocode({ lat, lon }: ReverseGeocodeInput): Promise<ReverseGeocodeOutput> {
    const url = new URL(`${NOMINATIM_URL}/reverse`);
    url.searchParams.set('format', 'json');
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
    url.searchParams.set('zoom', '14');
    url.searchParams.set('addressdetails', '1');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'ReviUy/1.0',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<ReverseGeocodeOutput>;
  }
}
