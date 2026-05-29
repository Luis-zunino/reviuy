import { describe, expect, it, vi } from 'vitest';
import { formatDataToBackend } from '../formatDataToBackend.util';

// Mock next/font/google as it's not meant to run in a test environment
vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mock-inter-class',
    style: {
      fontFamily: 'mock-inter',
    },
  }),
}));

describe('formatDataToBackend', () => {
  it('normalizes empty optional strings before creating a review', () => {
    const result = formatDataToBackend({
      title: 'Departamento muy recomendable',
      description: 'Muy buena experiencia en general, volveria a alquilar sin problemas.',
      rating: 5,
      property_type: 'apartment',
      address_text: '18 de Julio 1234, Montevideo',
      osm_id: '12345',
      osm_type: 'W',
      latitude: '-34.9011',
      longitude: '-56.1645',
      zone_rating: 4,
      winter_comfort: '',
      summer_comfort: '  ',
      humidity: '',
      real_estate_id: '',
      real_estate_name: '',
      real_estate_experience: '   ',
      apartment_number: ' ',
      review_rooms: [],
    });

    expect(result.address_osm_id).toBe('W12345');
    expect(result.real_estate_id).toBeNull();
    expect(result.winter_comfort).toBeUndefined();
    expect(result.summer_comfort).toBeUndefined();
    expect(result.humidity).toBeUndefined();
    expect(result.real_estate_experience).toBeUndefined();
    expect(result.apartment_number).toBeUndefined();
  });
});
