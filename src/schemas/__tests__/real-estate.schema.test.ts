import { describe, expect, it } from 'vitest';
import { formCreateRealEstateSchema } from '../real-estate.schema';

describe('formCreateRealEstateSchema', () => {
  it('passes with valid name', () => {
    const result = formCreateRealEstateSchema.safeParse({
      real_estate_name: 'Inmobiliaria Centro',
    });
    expect(result.success).toBe(true);
  });

  it('fails with empty name', () => {
    const result = formCreateRealEstateSchema.safeParse({
      real_estate_name: '',
    });
    expect(result.success).toBe(false);
  });

  it('fails with name shorter than 4 characters', () => {
    const result = formCreateRealEstateSchema.safeParse({
      real_estate_name: 'ABC',
    });
    expect(result.success).toBe(false);
  });

  it('fails with name longer than 100 characters', () => {
    const result = formCreateRealEstateSchema.safeParse({
      real_estate_name: 'A'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('fails when name is missing', () => {
    const result = formCreateRealEstateSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
