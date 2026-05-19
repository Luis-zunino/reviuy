import { describe, expect, it } from 'vitest';
import { formReviewSchema, formReviewRoomSchema, backendReviewSchema } from '../review.schema';

describe('formReviewRoomSchema', () => {
  it('passes with complete room data', () => {
    const result = formReviewRoomSchema.safeParse({
      room_type: 'bedroom',
      area_m2: 15,
    });
    expect(result.success).toBe(true);
  });

  it('fails with empty object because refinement always requires room fields', () => {
    const result = formReviewRoomSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('fails when room_type is missing but area_m2 is provided', () => {
    const result = formReviewRoomSchema.safeParse({ area_m2: 15 });
    expect(result.success).toBe(false);
  });

  it('fails when area_m2 is missing but room_type is provided', () => {
    const result = formReviewRoomSchema.safeParse({ room_type: 'bedroom' });
    expect(result.success).toBe(false);
  });

  it('fails when area_m2 is 0', () => {
    const result = formReviewRoomSchema.safeParse({
      room_type: 'bedroom',
      area_m2: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe('formReviewSchema', () => {
  const validReview = {
    title: 'Excelente propiedad bien ubicada',
    description: 'Una descripción suficientemente larga para pasar la validación de contenido.',
    rating: 4,
    property_type: 'apartment',
    address_text: 'Av. 18 de Julio 1234',
    osm_id: '12345',
    latitude: '-34.9011',
    longitude: '-56.1645',
    zone_rating: 3,
  };

  it('passes with valid complete data', () => {
    const result = formReviewSchema.safeParse(validReview);
    expect(result.success).toBe(true);
  });

  it('fails with short title', () => {
    const result = formReviewSchema.safeParse({ ...validReview, title: 'Corto' });
    expect(result.success).toBe(false);
  });

  it('fails with short description', () => {
    const result = formReviewSchema.safeParse({ ...validReview, description: 'Corto' });
    expect(result.success).toBe(false);
  });

  it('fails with rating below minimum', () => {
    const result = formReviewSchema.safeParse({ ...validReview, rating: 0 });
    expect(result.success).toBe(false);
  });

  it('fails with rating above maximum', () => {
    const result = formReviewSchema.safeParse({ ...validReview, rating: 6 });
    expect(result.success).toBe(false);
  });

  it('accepts optional fields', () => {
    const result = formReviewSchema.safeParse({
      ...validReview,
      winter_comfort: 'hot',
      summer_comfort: 'cool',
      humidity: 'normal',
      real_estate_id: 're-123',
      real_estate_name: 'Test Real Estate',
      apartment_number: '3B',
      images: [],
      review_rooms: [{ room_type: 'bedroom', area_m2: 12 }],
    });
    expect(result.success).toBe(true);
  });

  it('fails with too many images', () => {
    const result = formReviewSchema.safeParse({
      ...validReview,
      images: Array(6).fill(new File([], 'test.jpg')),
    });
    expect(result.success).toBe(false);
  });

  it('defaults images to empty array', () => {
    const result = formReviewSchema.safeParse(validReview);
    if (result.success) {
      expect(result.data.images).toEqual([]);
    }
  });
});

describe('backendReviewSchema', () => {
  const validBackendReview = {
    title: 'Excelente propiedad',
    description: 'Una descripción suficientemente larga para validar.',
    rating: 4,
    property_type: 'apartment',
    address_text: 'Av. 18 de Julio 1234',
    address_osm_id: '12345',
    latitude: -34.9011,
    longitude: -56.1645,
  };

  it('passes with valid backend data', () => {
    const result = backendReviewSchema.safeParse(validBackendReview);
    expect(result.success).toBe(true);
  });

  it('accepts nullable and optional fields', () => {
    const result = backendReviewSchema.safeParse({
      ...validBackendReview,
      zone_rating: null,
      real_estate_id: null,
      real_estate_experience: null,
      apartment_number: null,
      property_type: null,
    });
    expect(result.success).toBe(true);
  });

  it('fails with short title', () => {
    const result = backendReviewSchema.safeParse({ ...validBackendReview, title: 'Corto' });
    expect(result.success).toBe(false);
  });

  it('fails with string latitude/longitude', () => {
    const result = backendReviewSchema.safeParse({
      ...validBackendReview,
      latitude: '-34.9011',
    });
    expect(result.success).toBe(false);
  });
});
