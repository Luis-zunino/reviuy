import { describe, expect, it, vi } from 'vitest';
import { createGetAddressInfoQuery } from '../get-address-info.query';
import type { AddressReadRepository, GetAddressInfoOutput } from '../../../domain';
import { OsmType } from '@/enums';

describe('createGetAddressInfoQuery', () => {
  it('delegates address info lookup to the read repository', async () => {
    const expected: GetAddressInfoOutput = [
      {
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
        boundingbox: ['-34.91', '-34.90', '-56.17', '-56.16'],
        class: 'highway',
        display_name: 'Av. Italia 1234, Montevideo, Uruguay',
        importance: 0.7,
        lat: '-34.9011',
        licence: 'ODbL',
        lon: '-56.1645',
        name: 'Avenida Italia',
        osm_id: 123,
        osm_type: OsmType.WAY,
        place_id: 456,
        place_rank: 30,
        type: 'residential',
      },
    ];

    const repository: AddressReadRepository = {
      getAddressInfo: vi.fn().mockResolvedValue(expected),
      searchByName: vi.fn(),
      reverseGeocode: vi.fn(),
    };

    const handler = createGetAddressInfoQuery({ repository });
    const input = { osmId: '123' };

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.getAddressInfo).toHaveBeenCalledWith(input);
  });
});
