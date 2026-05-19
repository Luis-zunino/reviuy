import { describe, expect, it } from 'vitest';
import { formRealEstateSchema, createRealEstateReviewSchema } from '../real-estate-review.schema';

describe('formRealEstateSchema', () => {
  it('passes with valid data', () => {
    const result = formRealEstateSchema.safeParse({
      title: 'Buena inmobiliaria',
      description: 'Muy atentos y profesionales.',
      rating: 4,
    });
    expect(result.success).toBe(true);
  });

  it('fails with empty title', () => {
    const result = formRealEstateSchema.safeParse({
      title: '',
      description: 'Muy atentos y profesionales.',
      rating: 4,
    });
    expect(result.success).toBe(false);
  });

  it('fails with empty description', () => {
    const result = formRealEstateSchema.safeParse({
      title: 'Buena inmobiliaria',
      description: '',
      rating: 4,
    });
    expect(result.success).toBe(false);
  });

  it('fails with rating below 1', () => {
    const result = formRealEstateSchema.safeParse({
      title: 'Buena inmobiliaria',
      description: 'Muy atentos y profesionales.',
      rating: 0,
    });
    expect(result.success).toBe(false);
  });

  it('fails with rating above 5', () => {
    const result = formRealEstateSchema.safeParse({
      title: 'Buena inmobiliaria',
      description: 'Muy atentos y profesionales.',
      rating: 6,
    });
    expect(result.success).toBe(false);
  });

  it('passes with rating at boundaries', () => {
    const result = formRealEstateSchema.safeParse({
      title: 'Buena inmobiliaria',
      description: 'Muy atentos y profesionales.',
      rating: 1,
    });
    expect(result.success).toBe(true);
  });
});

describe('createRealEstateReviewSchema', () => {
  it('passes with valid data including real_estate_id', () => {
    const result = createRealEstateReviewSchema.safeParse({
      title: 'Buena inmobiliaria',
      description: 'Muy atentos y profesionales.',
      rating: 4,
      real_estate_id: 're-123',
    });
    expect(result.success).toBe(true);
  });

  it('fails when real_estate_id is missing', () => {
    const result = createRealEstateReviewSchema.safeParse({
      title: 'Buena inmobiliaria',
      description: 'Muy atentos y profesionales.',
      rating: 4,
    });
    expect(result.success).toBe(false);
  });
});
