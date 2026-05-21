import { describe, expect, it } from 'vitest';
import { translatePropertyType } from '../translatePropertyType.util';
import { PropertyType } from '@/enums/propertyType.enum';

describe('translatePropertyType', () => {
  it('returns "Apartamento" for APARTMENT', () => {
    expect(translatePropertyType(PropertyType.APARTMENT)).toBe('Apartamento');
  });

  it('returns "Casa" for HOUSE', () => {
    expect(translatePropertyType(PropertyType.HOUSE)).toBe('Casa');
  });

  it('returns "Habitación" for ROOM', () => {
    expect(translatePropertyType(PropertyType.ROOM)).toBe('Habitación');
  });

  it('returns "----" for unknown type', () => {
    expect(translatePropertyType('unknown')).toBe('----');
  });

  it('returns empty string for null', () => {
    expect(translatePropertyType(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(translatePropertyType(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(translatePropertyType('')).toBe('');
  });
});
