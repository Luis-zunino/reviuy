import { describe, expect, it, vi } from 'vitest';
import { createReverseGeocodeQuery } from '../reverse-geocode.query';
import type { AddressReadRepository, ReverseGeocodeOutput } from '../../../domain';
import { OsmType } from '@/enums';

describe('createReverseGeocodeQuery', () => {
  it('delegates reverse geocode to the read repository', async () => {
    const expected: ReverseGeocodeOutput = {
      address: {
        'ISO3166-2-lvl4': 'UY-MO',
        city: 'Montevideo',
        country: 'Uruguay',
        country_code: 'uy',
        house_number: '1234',
        postcode: '11200',
        road: 'Avenida Italia',
        state: 'Montevideo',
        suburb: 'Parque Batlle',
      },
      addresstype: 'road',
      boundingbox: [],
      class: 'highway',
      display_name: 'Av. Italia, Montevideo, Uruguay',
      importance: 0.7,
      lat: '-34.9011',
      licence: 'ODbL',
      lon: '-56.1645',
      name: 'Avenida Italia',
      osm_id: 123,
      osm_type: OsmType.RELATION,
      place_id: 456,
      place_rank: 30,
      type: 'residential',
    };

    const repository: AddressReadRepository = {
      getAddressInfo: vi.fn(),
      searchByName: vi.fn(),
      reverseGeocode: vi.fn().mockResolvedValue(expected),
    };

    const handler = createReverseGeocodeQuery({ repository });
    const input = { lat: -34.9011, lon: -56.1645 };

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.reverseGeocode).toHaveBeenCalledWith(input);
  });

  it('returns null when repository returns null', async () => {
    const repository: AddressReadRepository = {
      getAddressInfo: vi.fn(),
      searchByName: vi.fn(),
      reverseGeocode: vi.fn().mockResolvedValue(null),
    };

    const handler = createReverseGeocodeQuery({ repository });

    await expect(handler({ lat: 0, lon: 0 })).resolves.toBeNull();
  });

  it('rejects when repository throws', async () => {
    const repository: AddressReadRepository = {
      getAddressInfo: vi.fn(),
      searchByName: vi.fn(),
      reverseGeocode: vi.fn().mockRejectedValue(new Error('API error')),
    };

    const handler = createReverseGeocodeQuery({ repository });

    await expect(handler({ lat: 0, lon: 0 })).rejects.toThrow('API error');
  });
});
