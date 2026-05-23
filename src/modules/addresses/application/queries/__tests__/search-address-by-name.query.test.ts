import { describe, expect, it, vi } from 'vitest';
import { createSearchAddressByNameQuery } from '../search-address-by-name.query';
import type { AddressReadRepository, SearchAddressByNameOutput } from '../../../domain';
import { OsmType } from '@/enums';

describe('createSearchAddressByNameQuery', () => {
  it('delegates name search to the read repository', async () => {
    const expected: SearchAddressByNameOutput = [
      {
        place_id: 1,
        licence: 'ODbL',
        osm_type: OsmType.RELATION,
        osm_id: 123,
        lat: '-34.9011',
        lon: '-56.1645',
        class: 'highway',
        type: 'residential',
        place_rank: 30,
        importance: 0.7,
        addresstype: 'road',
        name: 'Avenida Italia',
        display_name: 'Av. Italia, Montevideo, Uruguay',
        boundingbox: ['-34.91', '-34.90', '-56.17', '-56.16'],
      },
    ];

    const repository: AddressReadRepository = {
      getAddressInfo: vi.fn(),
      searchByName: vi.fn().mockResolvedValue(expected),
      reverseGeocode: vi.fn(),
    };

    const handler = createSearchAddressByNameQuery({ repository });
    const input = { query: 'Av. Italia', countrycodes: 'uy', limit: 5 };

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.searchByName).toHaveBeenCalledWith(input);
  });

  it('rejects when repository throws', async () => {
    const repository: AddressReadRepository = {
      getAddressInfo: vi.fn(),
      searchByName: vi.fn().mockRejectedValue(new Error('Network error')),
      reverseGeocode: vi.fn(),
    };

    const handler = createSearchAddressByNameQuery({ repository });

    await expect(handler({ query: 'test' })).rejects.toThrow('Network error');
  });
});
