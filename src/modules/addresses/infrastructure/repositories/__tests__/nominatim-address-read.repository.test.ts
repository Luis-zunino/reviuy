import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { NominatimAddressReadRepository } from '../nominatim-address-read.repository';
import { AppError } from '@/lib/errors';
import { OsmType } from '@/enums/osmType.enum';
import type { NominatimByOsmId, NominatimEntity } from '../../../domain';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

describe('NominatimAddressReadRepository', () => {
  let repository: NominatimAddressReadRepository;

  beforeEach(() => {
    repository = new NominatimAddressReadRepository();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchByName', () => {
    const mockEntities: NominatimEntity[] = [
      {
        place_id: 1,
        licence: 'ODbL',
        osm_type: OsmType.WAY,
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

    it('returns parsed JSON array on success', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockEntities), { status: 200 })
      );

      const result = await repository.searchByName({ query: 'Av Italia' });

      expect(result).toEqual(mockEntities);
    });

    it('returns empty array on non-ok response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));

      const result = await repository.searchByName({ query: 'Av Italia' });

      expect(result).toEqual([]);
    });

    it('lets network errors propagate', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network failure'));

      await expect(repository.searchByName({ query: 'Av Italia' })).rejects.toThrow(
        'Network failure'
      );
    });

    it('constructs correct URL with default parameters', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockEntities), { status: 200 }));

      await repository.searchByName({ query: 'Av Italia' });

      expect(fetchSpy).toHaveBeenCalledWith(
        `${NOMINATIM_URL}/search?format=json&q=Av+Italia&countrycodes=uy&limit=5`,
        expect.objectContaining({
          headers: { 'User-Agent': 'ReviUy/1.0' },
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('uses custom parameters when provided', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockEntities), { status: 200 }));

      await repository.searchByName({ query: 'Sarandi', countrycodes: 'ar', limit: 10 });

      expect(fetchSpy).toHaveBeenCalledWith(
        `${NOMINATIM_URL}/search?format=json&q=Sarandi&countrycodes=ar&limit=10`,
        expect.anything()
      );
    });

    it('sets User-Agent header', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockEntities), { status: 200 }));

      await repository.searchByName({ query: 'Av Italia' });

      const callArg = fetchSpy.mock.calls[0][1] as RequestInit;
      expect(callArg.headers).toEqual({ 'User-Agent': 'ReviUy/1.0' });
    });

    it('sets 5-second timeout via AbortSignal', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockEntities), { status: 200 }));

      await repository.searchByName({ query: 'Av Italia' });

      const callArg = fetchSpy.mock.calls[0][1] as RequestInit;
      expect(callArg.signal).toBeInstanceOf(AbortSignal);
    });
  });

  describe('getAddressInfo', () => {
    const mockAddressInfo: NominatimByOsmId[] = [
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

    it('returns parsed JSON array on success', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockAddressInfo), { status: 200 })
      );

      const result = await repository.getAddressInfo({ osmId: 'W123' });

      expect(result).toEqual(mockAddressInfo);
    });

    it('throws AppError with INTERNAL_ERROR code on non-ok response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 404 }));

      let error: unknown;
      try {
        await repository.getAddressInfo({ osmId: 'W123' });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(AppError);
      if (error instanceof AppError) {
        expect(error.code).toBe('INTERNAL_ERROR');
        expect(error.message).toBe('Error consultando informacion de direccion');
      }
    });

    it('lets network errors propagate', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network failure'));

      await expect(repository.getAddressInfo({ osmId: 'W123' })).rejects.toThrow('Network failure');
    });

    it('constructs correct URL', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockAddressInfo), { status: 200 }));

      await repository.getAddressInfo({ osmId: 'R456' });

      expect(fetchSpy).toHaveBeenCalledWith(
        `${NOMINATIM_URL}/lookup?osm_ids=R456&format=json&extratags=1`,
        expect.objectContaining({
          headers: { 'User-Agent': 'ReviUy/1.0' },
        })
      );
    });
  });

  describe('reverseGeocode', () => {
    const mockOsmResult: NominatimByOsmId = {
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
    };

    it('returns parsed NominatimByOsmId on success', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockOsmResult), { status: 200 })
      );

      const result = await repository.reverseGeocode({ lat: -34.9011, lon: -56.1645 });

      expect(result).toEqual(mockOsmResult);
    });

    it('returns null when API responds with null body', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(null), { status: 200 })
      );

      const result = await repository.reverseGeocode({ lat: -34.9011, lon: -56.1645 });

      expect(result).toBeNull();
    });

    it('returns null on non-ok response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));

      const result = await repository.reverseGeocode({ lat: -34.9011, lon: -56.1645 });

      expect(result).toBeNull();
    });

    it('lets network errors propagate', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network failure'));

      await expect(repository.reverseGeocode({ lat: -34.9011, lon: -56.1645 })).rejects.toThrow(
        'Network failure'
      );
    });

    it('constructs correct URL', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockOsmResult), { status: 200 }));

      await repository.reverseGeocode({ lat: -34.9011, lon: -56.1645 });

      expect(fetchSpy).toHaveBeenCalledWith(
        `${NOMINATIM_URL}/reverse?format=json&lat=-34.9011&lon=-56.1645&zoom=14&addressdetails=1`,
        expect.objectContaining({
          headers: { 'User-Agent': 'ReviUy/1.0' },
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('sets User-Agent header', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockOsmResult), { status: 200 }));

      await repository.reverseGeocode({ lat: -34.9011, lon: -56.1645 });

      const callArg = fetchSpy.mock.calls[0][1] as RequestInit;
      expect(callArg.headers).toEqual({ 'User-Agent': 'ReviUy/1.0' });
    });

    it('sets 5-second timeout via AbortSignal', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockOsmResult), { status: 200 }));

      await repository.reverseGeocode({ lat: -34.9011, lon: -56.1645 });

      const callArg = fetchSpy.mock.calls[0][1] as RequestInit;
      expect(callArg.signal).toBeInstanceOf(AbortSignal);
    });
  });
});
